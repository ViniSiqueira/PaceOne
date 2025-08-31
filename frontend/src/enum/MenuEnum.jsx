import { FaCalendarAlt, FaDumbbell, FaMoneyBillAlt, FaTools, FaUsers } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { MdDirectionsBike } from "react-icons/md";

export const MenuEnum = [
    {
        label: 'Home',
        path: '/home',
        icon: <IoHome />
    },
    {
        label: 'Modalidades',
        path: '/listModality',
        icon: <MdDirectionsBike />
    },
    {
        label: 'Treinos',
        path: '/listTraining',
        icon: <FaDumbbell />
    },
    {
        label: 'Clientes',
        path: '/listClients',
        icon: <FaUsers />
    },
    {
        label: 'Financeiro',
        path: '/financial',
        icon: <FaMoneyBillAlt />
    },
    {
        label: 'Rotina',
        path: '/routine',
        icon: <FaCalendarAlt />
    },
    // {
    //     label: 'Configurações',
    //     path: '/home',
    //     icon: <FaTools />
    // }
];
