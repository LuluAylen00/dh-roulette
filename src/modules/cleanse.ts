const cleanse = (object) => {
    let array = [];
    for (let i = 0; i < object.length; i++) {
        type Element = {
            Grupo?: string,
            Nombre?: string
        }
        let element: Element = {};
        let claves = Object.keys(object[i]);
        let datos = Object.values(object[i]);
        let nuevaClave = [];
        claves.forEach((c, index) => {
            nuevaClave.push(c.replace(/"/g, ""));
            element[nuevaClave[index]] = datos[index];
        });
        if (!isNaN(parseInt(element.Grupo)) && element.Nombre.length > 0) {
            array.push(element);
        }
    }
    return array;
};

export { cleanse };
