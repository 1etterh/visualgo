import { createWebHistory, createRouter } from "vue-router";
import Login from "@/components/account/Login.vue";
import Editor from "@/components/analysis/Editor.vue";
import Register from "@/components/account/Register.vue";
const routes=[
    {
        path:'/',
        component:Editor
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/register',
        component: Register
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;