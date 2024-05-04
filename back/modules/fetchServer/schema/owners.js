const owners = {
    _id: {},
        TITLE: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Имя исполнителя",
            sort: true,
            editable: true,
            //list: []
        },
        BEST: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Лучший трек исполнителя",
            sort: true,
        },
        WORST: {
            type: 'String',
            require: true,
            default: 'None',
            loc: "Худший трек исполнителя",
            sort: true,
        },
        OVERAGE: {
            type: 'Number',
            require: true,
            default: 'None',
            loc: "Общая оценка исполнителя",
            sort: true,
        },
    };

    export default owners;