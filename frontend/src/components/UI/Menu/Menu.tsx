import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ModalProps extends React.PropsWithChildren {
  show: boolean;
  title: string;
  onClose: React.MouseEventHandler;
  getStartInfo: React.MouseEventHandler;
}

const Menu: React.FC<ModalProps> = ({ show, title, onClose, getStartInfo }) => {
  return (
    <div>
      <Backdrop show={show} />
      <motion.div
        className="modal show"
        style={{ display: show ? 'block' : 'none' }}
        onClick={onClose}
        animate={{ y: show ? 0 : -200 }}
        transition={{
          default: {
            duration: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          },
        }}
      >
        <div className="modal-dialog  modal-fullscreen-sm-down" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">{title}</h1>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>
                <Link to={'/'} onClick={getStartInfo}>
                  Акции
                </Link>
              </p>
              <p>
                <Link to={'/companies'} onClick={getStartInfo}>
                  Компании
                </Link>
              </p>
              <p>
                <Link to={'/contacts'} onClick={getStartInfo}>
                  Контакты
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Menu;
