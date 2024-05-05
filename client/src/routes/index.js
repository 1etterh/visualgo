import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/Login.vue";
import Editor from "@/components/Editor.vue";
const routes=[
    {
        path:'/login',
        component:Login
    },
    {
        path:'/',
        component:Editor
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;