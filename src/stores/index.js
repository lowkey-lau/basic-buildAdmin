import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; //数据持久化插件

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
