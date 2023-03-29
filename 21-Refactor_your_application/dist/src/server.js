"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const config_1 = __importDefault(require("./config"));
app_1.default.listen(config_1.default.PORT, () => {
    console.log(`[server] Server is running on port ${config_1.default.PORT}`);
});
//# sourceMappingURL=server.js.map