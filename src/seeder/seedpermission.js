const { AppDataSource } = require("../database/db");
const { Permission } = require("../Entity/permission.entity");
const slugify = require("slugify"); // Install via: npm install slugify

async function seedPermissions() {
  const permissionRepo = AppDataSource.getRepository(Permission);

  const permissions = [
    {
      name: "read",
      permission_group: "Dashboard",
      description: "Permission to read the dashboard",
    },
    {
      name: "create",
      permission_group: "User",
      description: "Permission to create users",
    },
    {
      name: "read",
      permission_group: "User",
      description: "Permission to view users",
    },
    {
      name: "update",
      permission_group: "User",
      description: "Permission to update users",
    },
    {
      name: "delete",
      permission_group: "User",
      description: "Permission to delete users",
    }, {
      name: "create",
      permission_group: "Job",
      description: "Permission to create jobs",
    },
    {
      name: "read",
      permission_group: "Job",
      description: "Permission to view jobs",
    },
    {
      name: "update",
      permission_group: "Job",
      description: "Permission to update jobs",
    },
    {
      name: "delete",
      permission_group: "Job",
      description: "Permission to delete jobs",
    },
    {
      name: "create",
      permission_group: "Roles",
      description: "Permission to create roles",
    },
    {
      name: "read",
      permission_group: "Roles",
      description: "Permission to view roles",
    },
    {
      name: "update",
      permission_group: "Roles",
      description: "Permission to update roles",
    },
    {
      name: "delete",
      permission_group: "Roles",
      description: "Permission to delete roles",
    },
    
  ];

  for (const perm of permissions) {
    const slug = slugify(`${perm.name} ${perm.permission_group}`, { lower: true });

    let existing = await permissionRepo.findOne({
      where: { slug },
      withDeleted: false,
    });

    if (!existing) {
      const newPerm = permissionRepo.create({
        name: perm.name,
        permission_group: perm.permission_group,
        slug,
        description: perm.description,
        is_blocked: false, // ✅ NEW FIELD
      });
      await permissionRepo.save(newPerm);
      console.log(`✅ Inserted: ${slug}`);
    } else {
      if (
        existing.name !== perm.name ||
        existing.permission_group !== perm.permission_group ||
        existing.description !== perm.description ||
        existing.is_blocked !== false
      ) {
        existing.name = perm.name;
        existing.permission_group = perm.permission_group;
        existing.description = perm.description;
        existing.is_blocked = false; // ✅ NEW FIELD
        await permissionRepo.save(existing);
        console.log(`🔁 Updated: ${slug}`);
      } else {
        console.log(`⚠️ Exists & Up-to-date: ${slug}`);
      }
    }
  }

  console.log("🎉 Permission seeding completed.");
}

module.exports = seedPermissions;
