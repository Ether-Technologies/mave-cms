export const DEMO_ORGANIZATIONS = [
  {
    name: "Platform Super Admin",
    email: "superadmin@mave.local",
    password: "password",
    highlight: true,
  },
  { name: "Acme Corporation", email: "admin@acme.demo", password: "password" },
  { name: "Beta Industries", email: "admin@beta.demo", password: "password" },
  { name: "Gamma Solutions", email: "admin@gamma.demo", password: "password" },
  { name: "Delta Media Group", email: "admin@delta.demo", password: "password" },
  { name: "Echo Travel Agency", email: "admin@echo.demo", password: "password" },
];

export default function DemoOrganizationPicker({ onSelect }) {
  return (
    <div className="mt-2">
      <p className="text-sm font-semibold text-brand mb-2">
        Try a demo organization (6 workspaces)
      </p>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {DEMO_ORGANIZATIONS.map((org) => (
          <button
            key={org.email}
            type="button"
            onClick={() => onSelect(org.email, org.password)}
            className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
              org.highlight
                ? "border-brand bg-brand/10 hover:bg-brand/15"
                : "border-gray-200 hover:border-brand hover:bg-brand/5"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">
              {org.name}
              {org.highlight && (
                <span className="ml-2 text-xs font-normal text-brand">
                  Full platform access
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{org.email}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
