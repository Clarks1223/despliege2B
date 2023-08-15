import { v4 as uuidv4 } from "uuid";
import Mensajes from "./Mensajes";
import { useState } from "react";
import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from 'sweetalert2';
import * as Yup from "yup";

export const Formulario = ({ setEstado, idMetro, setIdMetro }) => {
  const [isEditing, setIsEditing] = useState(false);
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    sector: Yup.string().required("El sector es obligatorio"),
    salida: Yup.string().required("El punto de salida es obligatorio"),
    llegada: Yup.string().required("El punto de llegada es obligatorio"),
    maquinista: Yup.string().required(
      "El nombre del maquinista es obligatorio"
    ),
    detalles: Yup.string().required("Los detalles son obligatorios"),
  });

  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    if(showNotification){
        setTimeout(() => {
            setShowNotification(false);
        }, 2000)
    }
  })
  const [form, setForm] = useState({
    nombre: "",
    sector: "",
    salida: "",
    llegada: "",
    maquinista: "",
    detalles: "",
  });

  useEffect(() => {
    if (idMetro) {
      (async function (idMetro) {
        try {
          const respuesta = await (
            await fetch(
              `https://64daf952593f57e435b04fa0.mockapi.io/api/metro/${idMetro}`
            )
          ).json();
          const { id, nombre, sector, salida, llegada, maquinista, detalles } =
            respuesta;
          setForm({
            ...form,
            nombre,
            sector,
            salida,
            llegada,
            maquinista,
            detalles,
            id,
          });
          setIsEditing(true); // Cambia el estado a modo de edición al cargar los datos
        } catch (error) {
          console.log(error);
        }
      })(idMetro);
    }
  }, [idMetro]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    //impide que se pierdan los datos con la actualización de página
    e.preventDefault();
    // validadción de campos vacíos
    if (Object.values(form).includes("") || Object.entries(form).length === 0) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
      return;
    }
    try {
      if (form.id) {
        const url = `https://64daf952593f57e435b04fa0.mockapi.io/api/metro/${form.id}`;
        await fetch(url, {
          method: "PUT",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        });
        setEstado(true);
        setForm({});
        setIdMetro(null);
        setIsEditing(false);
        setTimeout(() => {
          setEstado(false);
          setForm({});
        }, 1000);
      } else {
        const url = "https://64daf952593f57e435b04fa0.mockapi.io/api/metro";
        form.id = uuidv4();
        await fetch(url, {
          // Método para crear un nuevo recurso
          method: "POST",
          // Convierte el formulario en JSON
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        });
        setForm({
        nombre: "",
        sector: "",
        salida: "",
        llegada: "",
        maquinista: "",
        detalles: "",
      });
        setMensaje(true);
        setEstado(true);
        setShowNotification(true);
        Swal.fire("RUTA CREADA!!")
        setTimeout(() => {
          setMensaje(false);
          setEstado(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log("Id antes del return:", idMetro);
  console.log("form antes del return:", form);
  return (
    <Formik
      initialValues={form}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <form onSubmit={handleSubmit}>
        {error && <Mensajes tipo="bg-red-900">Existen campos vacíos</Mensajes>}
        {mensaje && <Mensajes tipo="bg-green-900">Registro exitoso</Mensajes>}
        <Mensajes tipo={"bg-red-900"}>Validar campos</Mensajes>

        <div>
          <label
            htmlFor="nombre"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Nombre:{" "}
          </label>
          <input
            id="nombre"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="nombre de la ruta"
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="nombre"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="sector"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Sector:{" "}
          </label>
          <input
            id="sector"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="sector de la ruta"
            name="sector"
            value={form.sector || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="sector"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="salida"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Punto de salida:{" "}
          </label>
          <input
            id="salida"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="punto de salida"
            name="salida"
            value={form.salida || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="salida"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="llegada"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Punto de llegada:{" "}
          </label>
          <input
            id="llegada"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="punto de llegada"
            name="llegada"
            value={form.llegada || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="llegada"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>

        <div>
          <label
            htmlFor="maquinista"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Nombre del maquinista:{" "}
          </label>
          <input
            id="maquinista"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            placeholder="nombre del maquinista"
            name="maquinista"
            value={form.maquinista || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="maquinista"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>
        <div>
          <label
            htmlFor="detalles"
            className="text-gray-700 uppercase font-bold text-sm"
          >
            Detalles:{" "}
          </label>
          <textarea
            id="detalles"
            type="text"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
            name="detalles"
            value={form.detalles || ""}
            onChange={handleChange}
            pattern="^[A-Za-z]+$"
            title="Ingrese solo letras"
          />
          <ErrorMessage
            name="detalles"
            component="div"
            className="text-red-500 text-xs"
          />
        </div>

        <input
          type="submit"
          className="bg-sky-900 w-full p-3 
                      text-white uppercase font-bold rounded-lg 
                      hover:bg-red-900 cursor-pointer transition-all"
          value={form.id ? "Actualizar ruta" : "Registrar ruta"}
          onClick={() => {
            setIsEditing(true);
          }}
        />

        {isEditing && form.id && (
          <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white uppercase font-bold rounded-lg py-2 px-4 mt-3"
          onClick={() => {
            window.location.reload(); // Recargar página al dar clic solo si está en modo edición
          }}
        >
          Cancelar
        </button>
        
        )}
      </form>
    </Formik>
  );
};
