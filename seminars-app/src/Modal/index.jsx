import s from './style.module.css'

const Modal = ({ closeModal, children }) => {
    return (
        <>
            <div className={s.modal_overlay} onClick={closeModal}></div>
            <div className={s.modal}>
                {children}
            </div>
        </>
    )
}

export default Modal