const brands = {
    _id: {},
    TITLE: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Название",
        sort: true,
        editable: true,
        searchable: true,
        //list: []
    },
    ARTIST: {
        type: 'String',
        require: true,
        default: 'None',
        loc: "Исполнитель",
        sort: true,
        editable: true,
        searchable: true,
    },
    RHYMES: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: "Рифмы/Образы",
        sort: true,
        editable: true,
        filter: true,
        step: 0.1,
        sim: 'OVERALL'
    },
    RHYTHMICS: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: "Ритмика/Структура",
        sort: true,
        editable: true,
        filter: true,
        step: 0.1,
        sim: 'OVERALL'
    },
    INDIVIDUALITY: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: "Индивидуальность/Харизма",
        sort: true,
        editable: true,
        filter: true,
        step: 0.1,
        sim: 'OVERALL'
    },
    ATMOSPHERE: {
        type: 'Rating',
        require: true,
        default: 0,
        loc: "Атмосфера/Вайб",
        sort: true,
        editable: true,
        filter: true,
        step: 0.1,
        sim: 'OVERALL'
    },
    OVERALL: {
        type: 'Rating',
        step: 0.25,
        require: true,
        loc: "Общая оценка",
        sort: true,
        editable: false,
        default: 0,
        method: 'OVERAGE',
        fields: ['ATMOSPHERE', 'INDIVIDUALITY', 'RHYTHMICS', 'RHYMES']
    }
};

export default brands;