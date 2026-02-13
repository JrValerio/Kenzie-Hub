let state;

const cloneDate = (date) => new Date(date);

const cloneTech = (tech) => ({
  ...tech,
  createdAt: cloneDate(tech.createdAt),
  updatedAt: cloneDate(tech.updatedAt),
});

const cloneUser = (user) => ({
  ...user,
  createdAt: cloneDate(user.createdAt),
  updatedAt: cloneDate(user.updatedAt),
});

const normalizeCase = (value) => String(value).toLowerCase();

const matchTechWhere = (tech, where = {}) => {
  return Object.entries(where).every(([key, value]) => {
    if (key === "title" && value && typeof value === "object") {
      const { equals, mode } = value;
      if (mode === "insensitive") {
        return normalizeCase(tech.title) === normalizeCase(equals);
      }
      return tech.title === equals;
    }

    if (value && typeof value === "object" && "not" in value) {
      return tech[key] !== value.not;
    }

    return tech[key] === value;
  });
};

const selectFields = (payload, select) => {
  if (!select) {
    return payload;
  }

  const selected = {};
  Object.entries(select).forEach(([field, enabled]) => {
    if (enabled) {
      selected[field] = payload[field];
    }
  });
  return selected;
};

export const resetPrismaMock = () => {
  state = {
    users: [],
    techs: [],
    userCounter: 0,
    techCounter: 0,
  };
};

const buildUserWithTechs = (user) => {
  const techs = state.techs
    .filter((tech) => tech.userId === user.id)
    .map(cloneTech);

  return {
    ...cloneUser(user),
    techs,
  };
};

resetPrismaMock();

export const prismaMock = {
  user: {
    findUnique: async ({ where, include, select } = {}) => {
      const foundUser = state.users.find((user) => {
        if (where?.email) {
          return user.email === where.email;
        }

        if (where?.id) {
          return user.id === where.id;
        }

        return false;
      });

      if (!foundUser) {
        return null;
      }

      if (include?.techs) {
        return buildUserWithTechs(foundUser);
      }

      return selectFields(cloneUser(foundUser), select);
    },
    create: async ({ data, include } = {}) => {
      const now = new Date();
      const user = {
        id: `user-${++state.userCounter}`,
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        bio: data.bio,
        contact: data.contact,
        courseModule: data.courseModule,
        createdAt: now,
        updatedAt: now,
      };

      state.users.push(user);

      if (Array.isArray(data?.techs?.create)) {
        data.techs.create.forEach((techData) => {
          state.techs.push({
            id: `tech-${++state.techCounter}`,
            title: techData.title,
            status: techData.status,
            userId: user.id,
            createdAt: now,
            updatedAt: now,
          });
        });
      }

      if (include?.techs) {
        return buildUserWithTechs(user);
      }

      return cloneUser(user);
    },
  },
  tech: {
    findFirst: async ({ where, select } = {}) => {
      const foundTech = state.techs.find((tech) => matchTechWhere(tech, where));

      if (!foundTech) {
        return null;
      }

      return selectFields(cloneTech(foundTech), select);
    },
    create: async ({ data } = {}) => {
      const now = new Date();
      const tech = {
        id: `tech-${++state.techCounter}`,
        title: data.title,
        status: data.status,
        userId: data.userId,
        createdAt: now,
        updatedAt: now,
      };

      state.techs.push(tech);
      return cloneTech(tech);
    },
    update: async ({ where, data } = {}) => {
      const index = state.techs.findIndex((tech) => tech.id === where.id);

      if (index < 0) {
        throw new Error("Technology not found");
      }

      const current = state.techs[index];
      const updated = {
        ...current,
        ...data,
        updatedAt: new Date(),
      };

      state.techs[index] = updated;
      return cloneTech(updated);
    },
    delete: async ({ where } = {}) => {
      const index = state.techs.findIndex((tech) => tech.id === where.id);

      if (index < 0) {
        throw new Error("Technology not found");
      }

      const [removed] = state.techs.splice(index, 1);
      return cloneTech(removed);
    },
  },
};
