# Admin Scripts

## Add Admin User

Script to create admin users in the database.

### Usage

**Interactive mode** (prompts for input):
```bash
cd admin
pnpm add-admin
```

**Command line mode** (with arguments):
```bash
cd admin
pnpm add-admin "John Doe" "admin@example.com" "secure-password"
```

### Requirements

- `DATABASE_URL` must be set in `.env` file
- Prisma client must be generated (`pnpm prisma:generate` from root)

### Example

```bash
# From root directory
cd admin
pnpm add-admin "Admin User" "admin@modonty.com" "MySecurePassword123!"
```

The script will:
- Validate email format
- Check if user already exists
- Hash the password using bcrypt
- Create the user with ADMIN role
- Display success message with user details
