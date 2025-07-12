import { FaCalendarAlt, FaDumbbell, FaMoneyBillAlt, FaTools, FaUsers } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";

export const MenuEnum = [
    {
        label: 'Modalidades',
        path: '/home',
        icon: <MdDirectionsBike />
    },
    {
        label: 'Treinos',
        path: '/home',
        icon: <FaDumbbell />
    },
    {
        label: 'Clientes',
        path: '/home',
        icon: <FaUsers />
    },
    {
        label: 'Financeiro',
        path: '/home',
        icon: <FaMoneyBillAlt />
    },
    {
        label: 'Rotina',
        path: '/home',
        icon: <FaCalendarAlt />
    },
    {
        label: 'Configurações',
        path: '/home',
        icon: <FaTools />
    }
];
