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