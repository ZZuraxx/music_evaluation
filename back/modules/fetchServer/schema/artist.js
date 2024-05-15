const artist = {
    _id: {},
    TITLE: {
        type: "String",
        require: true,
        default: "None",
        loc: "Название",
        sort: true,
        editable: true,
    },
    MAX: {
        type: 'Max',
        editable: false,
        default: 0,
        loc: 'Max',
        sort: false,
        readOnly: true,
        collection: 'brands',
        field: 'OVERAGE'
    },
    MIN: {
        type: 'Min',
        editable: false,
        default: 0,
        loc: 'Min',
        sort: false,
        readOnly: true,
        collection: 'brands',
        field: 'OVERAGE'
    }
};

export default artist;
