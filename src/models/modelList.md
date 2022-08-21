## Métodos del modelo

### fileLister
> Busca todos los archivos en la carpeta /src/data y devuelve aquellos .xls y .csv ordenados con un id relativo, tienen las propiedades:
- **filename**: Nombre del archivo.
- **ext**: Extensión, para poder realizar el formato mas adelante.
- **name**: Nombre sin extensión para darle el nombre al JSON mas adelante.
- **id**: ID relativo, solo de los elementos .xls y .csv, no afecta ni es afectado por los archivos JSON ni otros tipos de elementos.
****

### allToJson 
> Itera por los archivos provinientes de **fileLister**, con los respectivos módulos de conversión los abre, convierte, crea un array para TODOS los archivos y crea un array dentro para cada archivo encontrado, a cada archivo le asigna las propiedades:
- **data**: Listado de alumnos de ese archivo, solamente con la columna que tenga el nombre en particular.
- **ext**: Extensión, para poder realizar el formato en el siguiente paso.
- **name**: Nombre sin extensión para darle el nombre al JSON mas adelante.
- **id**: ID relativo heredado del paso anterior.
****

### allParser
> Itera por el array creado por **allToJson** y, además, por cada array que haya dentro, reemplaza las propiedades de los objetos por:
- **data**: Listado de alumnos de ese archivo, pero esta vez ordenados con el formato de "Nombre y Apellido" y un id para cada alumno.
- **ext**: Extensión, para poder realizar el formato en el siguiente paso.
- **name**: Nombre sin extensión para darle el nombre al JSON en el paso siguiente.
- **id**: ID relativo heredado del paso anterior por el cual será seleccionado este archivo para crear el JSON en el paso siguiente.
****

### findFile
> Toma un ID por parámetro, devuelve el archivo .xls o .csv que corresponda con el ID ingresado.
****

### saveJson
> Toma un ID por parámetro y un string opcional que representa la comisión (función aún no implementada) busca ese ID entre los archivos .xls/.csv y crea un archivo .json con un objeto que posee las propiedades: 
- **data**: Listado de alumnos ordenados con el formato de "Nombre y Apellido" y un ID para cada alumno.
- **id**: ID absoluto para ubicar el JSON (ya como base de datos final, de la que la ruleta debe recuperar los datos).
- **com**: Propiedad string inicialmente vacía, que recibiría el código de comisión para un buscador mas adelante.
****