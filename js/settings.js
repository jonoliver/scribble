const development = {
  gameTime: 10,
};

const production = {
  gameTime: 45,
}

const config = {
  development,
  production
}

const { ENV = 'production' } = process.env;

const settings =config[ENV];

if (process.env.ENV === 'development'){
  window.settings = settings;
}

export default settings;
