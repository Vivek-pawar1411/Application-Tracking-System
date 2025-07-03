const { EntitySchema } = require("typeorm");

const Meeting = new EntitySchema({
  name: "Meeting",
  tableName: "meetings",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    agenda: {
      type: "text",
      nullable: true,
    },
    scheduledAt: {
      type: "timestamp",
      nullable: false,
    },
    durationMinutes: {
      type: "int",
      nullable: true,
    },
    location: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    }
  },
  relations: {
    createdBy: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "created_by" },
      eager: true,
    },
    attendees: {
      type: "many-to-many",
      target: "User",
      joinTable: {
        name: "meeting_attendees",
        joinColumn: {
          name: "meeting_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "user_id",
          referencedColumnName: "id",
        },
      },
      eager: true,
    }
  }
});

module.exports = { Meeting };
