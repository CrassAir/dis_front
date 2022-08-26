import {IAccount} from "../models/IAuth";
import {INavItem} from "../App";
import {IMoving} from "../models/IKit";

const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export const stringAvatar = (name: string) => ({
    sx: {
        bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ').length > 1 ? name.split(' ')[1][0] : ''}`,
});

export const localizationMT = {
    body: {
        emptyDataSourceMessage: "Данных пока нет",
        addTooltip: 'Создать',
        deleteTooltip: 'Удалить',
        editTooltip: 'Редактировать',
        filterRow: {
            filterTooltip: 'Фильтр'
        },
        editRow: {
            deleteText: 'Вы уверены что хотите удалить строку?',
            cancelTooltip: 'Отмена',
            saveTooltip: 'Сохранить'
        }
    },
    grouping: {
        // placeholder: "Tirer l'entête ...",
        groupedBy: 'Групировать по:'
    },
    header: {
        actions: 'Действия'
    },
    pagination: {
        labelDisplayedRows: '{from}-{to} всего {count}',
        labelRowsSelect: 'строк',
        labelRowsPerPage: 'Строк на странице:',
        firstAriaLabel: 'Первая страница',
        firstTooltip: 'Первая страница',
        previousAriaLabel: 'Предыдущая страница',
        previousTooltip: 'Предыдущая страница',
        nextAriaLabel: 'Следующая страница',
        nextTooltip: 'Следующая страница',
        lastAriaLabel: 'Последняя страница',
        lastTooltip: 'Последняя страница'
    },
    toolbar: {
        // addRemoveColumns: 'Ajouter ou supprimer des colonnes',
        // nRowsSelected: '{0} ligne(s) sélectionée(s)',
        // showColumnsTitle: 'Voir les colonnes',
        // showColumnsAriaLabel: 'Voir les colonnes',
        // exportTitle: 'Exporter',
        // exportAriaLabel: 'Exporter',
        // exportName: 'Exporter en CSV',
        searchTooltip: 'Поиск',
        searchPlaceholder: 'Поиск'
    }
}

export const convertListToObject = (list: any[]) => {
    return list.reduce((acc: any, cur, i) => {
        acc[cur.id] = cur.name;
        return acc;
    }, {})
}

export const updateElementInList = (list: any[], newEl: any) => {
    return list.map(el => {
        if (el.id === newEl.id) return newEl
        return el
    })
}

export const deleteElementFromList = (list: any[], id: number) => {
    const newList: any[] = [];
    list.forEach(el => {
        if (el.id !== id) {
            newList.push(el)
        }
    })
    return newList
}


export const changeNavListOnValidate = (user: IAccount, navList: INavItem[]) => {
    if (!user) return []
    if (user.is_superuser) return navList
    if (!user.role) return []
    return navList.filter(nav => user.role.read.some(val => val.name_plural === nav.validate))
}

export const validateEditAccess = (user: IAccount, valName: string) => {
    if (!user) return []
    if (user.is_superuser) return true
    if (!user.role) return false
    return user.role.edit.some(val => val.name_plural === valName)
}


export const disableByMovingStatus = (user: IAccount, moving: IMoving, btn: string) => {
    if (user.is_superuser) return false
    if (moving.last_status_name === 'sent') {
        if (btn === 'accept') {
            return !(validateEditAccess(user!, 'delivery') && user?.team_name === moving.to_team_name)
        }
        if (btn === 'cancel') {
            return !(validateEditAccess(user!, 'delivery') && (user?.id === moving.creator || user?.team_name === moving.to_team_name))
        }
    }
    if (moving.last_status_name === 'back') {
        if (btn === 'accept') {
            return !(validateEditAccess(user!, 'delivery') && user?.id === moving.creator)
        }
        if (btn === 'cancel') {
            return !(validateEditAccess(user!, 'delivery') && (user?.id === moving.recipient || user?.id === moving.creator))
        }
    }
    return true
}
