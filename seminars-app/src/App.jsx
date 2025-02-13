import { useEffect, useState } from 'react'
import './App.css'
import Seminar from './Seminar';
import Modal from './Modal';

function App() {
  const [seminars, setSeminars] = useState([]);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
    photo: ''
  });

  // Загрузка списка семинаров с обработкой ошибок
  useEffect(() => {
    const fetchSeminars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/seminars');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных');
        }
        const data = await response.json();
        setSeminars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  // открытие формы удаления
  const handleDelete = (seminar) => {
    setSelectedSeminar(seminar);
    setModal('modalDelete');
  }

  // Удаление семинара
  const confirmDelete = async () => {
    if (!selectedSeminar) return;

    try {
      const response = await fetch(`http://localhost:5000/seminars/${selectedSeminar.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }
      // Обновляем список после удаления
      setSeminars(seminars.filter((s) => s.id !== selectedSeminar.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setModal(null);
    }
  };

  // Открытие формы редактирования
  const handleEdit = (seminar) => {
    setSelectedSeminar(seminar);
    setFormData({
      title: seminar.title,
      description: seminar.description,
      time: seminar.time,
      date: seminar.date,
      photo: seminar.photo,
    });
    setModal('modalEdit');
  };

  // Редактирование семинара с обработкой ошибок
  const handleEditSeminar = async (e) => {
    e.preventDefault();
    if (!selectedSeminar) return;

    try {
      const response = await fetch(`http://localhost:5000/seminars/${selectedSeminar.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: selectedSeminar.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при редактировании');
      }

      const updatedSeminar = await response.json();
      setSeminars(seminars.map((s) => (s.id === updatedSeminar.id ? updatedSeminar : s)));
    } catch (err) {
      setError(err.message);
    } finally {
      setModal(null);
    }
  };

  // Обновление данных формы
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const formatedDate = value.split("-").reverse().join(".");
      setFormData({ ...formData, [name]: formatedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }

  };

  return (
    <>
      {loading && <p>Загрузка данных...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {seminars?.map((seminar) =>
          <Seminar
            key={seminar.id}
            data={seminar}
            handleDelete={() => handleDelete(seminar)}
            handleEdit={() => handleEdit(seminar)}
          />
        )}
      </ul>

      {modal === 'modalDelete' &&
        <Modal
          closeModal={() => setModal(null)}
        >
          <p>Вы точно хотите удалить этот семинар?</p>
          <button onClick={() => confirmDelete()}>Да</button>
          <button onClick={() => setModal(null)}>Нет</button>
        </Modal>
      }

      {modal === 'modalEdit' &&
        <Modal
          closeModal={() => setModal(null)}
        >
          <form action="" onSubmit={(e) => handleEditSeminar(e)}>
            <input type="text" name='title' placeholder='Title' onChange={(e) => handleChange(e)} value={formData.title} />
            <input type="text" name='description' placeholder='Description' onChange={(e) => handleChange(e)} value={formData.description} />
            <input type="time" name='time' onChange={(e) => handleChange(e)} value={formData.time} />
            <input type="date" name='date' onChange={(e) => handleChange(e)} value={formData.date ? formData.date.split(".").reverse().join("-") : ""} />
            <input type='text' name='photo' onChange={(e) => handleChange(e)} value={formData.photo} />
            <button>Редактировать</button>
          </form>
          <button onClick={() => setModal(null)}>Отмена</button>
        </Modal>
      }
    </>
  )
}

export default App
