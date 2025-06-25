const { AppDataSource } = require("../database/db");
const { Permission } = require("../Entity/permission.entity");

const seedPermissions = async () => {
  try {
    // await AppDataSource.initialize();
    // console.log("📦 Database connected.");
      console.log("🚀 Seeding permissions...");
    const permissionRepository = AppDataSource.getRepository(Permission);

    const permissionGroups = [
      {
        group: "User Management",
        actions: ["create", "read", "update", "delete"],
      },
      {
        group: "Role Management",
        actions: ["create", "read", "update", "delete"],
      },
      {
        group: "Job Management",
        actions: ["create", "read", "update", "delete"],
      },
      {
        group: "Application Review",
        actions: ["read", "update"],
      },
    ];

    const permissions = [];

    for (const pg of permissionGroups) {
      for (const action of pg.actions) {
        const slug = `${pg.group.toLowerCase().replace(/\s+/g, "_")}_${action}`;
        permissions.push({
          name: `${action.charAt(0).toUpperCase() + action.slice(1)} ${pg.group}`,
          slug: slug,
          permission_group: pg.group,
          description: `${action} permission for ${pg.group}`,
        });
      }
    }

    for (const perm of permissions) {
      const exists = await permissionRepository.findOneBy({ slug: perm.slug });
      if (!exists) {
        const newPermission = permissionRepository.create(perm);
        await permissionRepository.save(newPermission);
        console.log(`✅ Inserted: ${perm.slug}`);
      } else {
        console.log(`⚠️ Already exists: ${perm.slug}`);
      }
    }

    console.log("🎉 Permission seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding permissions:", err);
    process.exit(1);
  }
};

module.exports = seedPermissions;
