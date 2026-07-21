# EBANX take-home

In-memory account API. NestJS + TypeScript. No database, no persistence — matches spec.

## Endpoints

- `POST /reset` — wipes all state, 200.
- `GET /balance?account_id=X` — 404 + `0` if missing, else 200 + plain balance number.
- `POST /event` — `{"type": "deposit"|"withdraw"|"transfer", ...}`. 201 on success, 404 + `0` if origin missing, 400 on bad input or insufficient funds.

## Run

```bash
npm install
npm run start        # Defaults to http://localhost:3000
```

Manual testing: `client.http` at project root (Kulala/REST Client compatible).

## Test

```bash
npm test              # unit tests
npm run test:e2e      # end-to-end tests
npm run lint
```

## Key decisions

- **State**: `Map<string, Account>` in `AccountsRepository`, mutated in place. My instinct was ledger-style (append-only log, balance derived) since that's how real banking systems work, but the spec specifically said to keep it simple and not over-engineer.
- **Layering**: HTTP (controllers) → business rules (`EventService`, `BalanceService`) → storage (`AccountsRepository`). Repository knows nothing about balances/amounts, only get/set on whole `Account` objects.
- **Fully synchronous**, no `async`/`await` anywhere in the request path. In-memory + JS single-thread gives `transfer` atomicity for free — no yield point exists where two requests could interleave. Would need explicit per-account locking if persistence were added later (real I/O reintroduces yield points).
- **Validation**: one DTO class per event type (`DepositEventDto`/`WithdrawEventDto`/`TransferEventDto`), picked and validated inline in the controller via `class-validator`/`class-transformer`. Avoids a shared flat DTO with optional-by-convention fields, and avoids a custom discriminator pipe — both were tried, both added more indirection than the problem needed.
- **404 body**: spec requires a literal `0`, not a JSON error object. A global `NotFoundExceptionFilter` (`src/filters/`) overrides Nest's default error shape for `NotFoundException` only.
- **Errors**: `NotFoundException` (404) for missing accounts, `BadRequestException` (400) for insufficient funds, unknown event type, or invalid input shape.

## Would do differently for production

- Ledger-style architecture: append-only event log as the source of truth, balance derived/cached from it. More powerful than the direct-balance model here — gives real audit trail, replay, point-in-time balance — at the cost of more write surface per operation. Out of scope for this exercise, but the direction I'd take for a real banking system.
- Persistence (DB or event log) — explicitly out of scope here.
- Per-account locking once real I/O is introduced (see "Fully synchronous" above).
