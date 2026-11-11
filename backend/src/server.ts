import { createApp } from "./app.js";
import { config } from "./config.js";

createApp().listen(config.port, () => {
  console.log(`Backend escuchando en http://localhost:${config.port}`);
});
