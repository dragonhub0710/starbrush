module.exports = (sequelize, Sequelize) => {
  const Prompt = sequelize.define("prompt", {
    name: {
      type: Sequelize.STRING,
    },
    prompt: {
      type: Sequelize.TEXT,
    },
  });

  return Prompt;
};
