module.exports = {
  HOST: "44.202.145.155",
  USER: "postgres",
  PASSWORD: "123456",
  DB: "postgres",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
