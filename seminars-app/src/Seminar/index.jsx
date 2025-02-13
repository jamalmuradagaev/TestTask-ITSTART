import s from './style.module.css'

const Seminar = ({data, handleDelete, handleEdit}) => {
    return (
        <li key={data.id} className={s.seminar}>
            {data.photo && <img src={data.photo} className={s.image} />}
            <h3 className={s.title}>{data.title}</h3>
            <p className={s.description}>{data.description}</p>
            <p className={s.time}>{data.time}</p>
            <p className={s.date}>{data.date}</p>
            <button className={s.button} onClick={handleDelete}>Удалить</button>
            <button className={s.button} onClick={handleEdit}>Редактировать</button>
        </li>
    )
}

export default Seminar