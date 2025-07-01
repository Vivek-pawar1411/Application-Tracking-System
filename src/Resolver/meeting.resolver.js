const { AppDataSource } = require("../database/db");
const { Meeting } = require("../Entity/meeting.entity");
const { User } = require("../Entity/user.entity");

const meetingRepo = () => AppDataSource.getRepository(Meeting);
const userRepo = () => AppDataSource.getRepository(User);

const meetingResolvers = {
  Query: {
    meetings: async () => {
      return await meetingRepo().find();
    },
    meeting: async (_, { id }) => {
      return await meetingRepo().findOne({ where: { id } });
    },
  },

  Mutation: {
    createMeeting: async (_, { input }) => {
      const {
        title,
        agenda,
        scheduledAt,
        durationMinutes,
        location,
        createdById,
        attendeeIds = [],
      } = input;

      const createdBy = await userRepo().findOne({ where: { id: createdById } });
      if (!createdBy) throw new Error("Creator user not found");

      const attendees = await userRepo().findByIds(attendeeIds);

      const newMeeting = meetingRepo().create({
        title,
        agenda,
        scheduledAt,
        durationMinutes,
        location,
        createdBy,
        attendees,
      });

      return await meetingRepo().save(newMeeting);
    },

    updateMeeting: async (_, { id, input }) => {
      const meeting = await meetingRepo().findOne({ where: { id } });
      if (!meeting) throw new Error("Meeting not found");

      Object.assign(meeting, input);

      if (input.attendeeIds) {
        meeting.attendees = await userRepo().findByIds(input.attendeeIds);
      }

      return await meetingRepo().save(meeting);
    },

    deleteMeeting: async (_, { id }) => {
      const meeting = await meetingRepo().findOne({ where: { id } });
      if (!meeting) throw new Error("Meeting not found");

      await meetingRepo().remove(meeting);
      return "Meeting deleted successfully";
    }
  }
};

module.exports =  meetingResolvers ;
