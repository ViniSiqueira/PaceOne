import { FaCalendarAlt, FaDumbbell, FaMoneyBillAlt, FaTools, FaUsers } from "react-icons/fa";
import { MdDirectionsBike } from "react-icons/md";

export const MenuEnum = [
    {
        label: 'Modalidades',
        path: '/listModality',
        icon: <MdDirectionsBike />
    },
    {
        label: 'Treinos',
        path: '/home',
        icon: <FaDumbbell />
    },
    {
        label: 'Clientes',
        path: '/listClients',
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
