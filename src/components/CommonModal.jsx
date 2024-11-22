import React, { useEffect } from 'react';
import Modal from 'react-modal';
import Button from './Btn';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const CommonModal = ({
    isOpen,
    onRequestClose,
    type = 1,
    title,
    children,
    navigateTo,
    onConfirm,
}) => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        if (navigateTo) navigate(navigateTo);
        if (onConfirm) onConfirm();
        onRequestClose();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => (document.body.style.overflow = 'unset');
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={title}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1500,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: '410px',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    border: 'none', // 스타일링 개선
                },
            }}
            shouldCloseOnOverlayClick={true}
        >
            <div
                style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    marginBottom: '15px',
                    textAlign: 'center',
                }}
            >
                {title}
            </div>

            <div
                style={{
                    fontSize: '16px',
                    marginBottom: '40px',
                    textAlign: 'center',
                }}
            >
                {children}
            </div>

            {type === 1 && (
                <Button
                    onClick={handleConfirm}
                    width="400px"
                    height="50px"
                    borderRadius="10px"
                    borderColor="#59ABE6"
                    fontSize="18px"
                    backgroundColor="#59ABE6"
                    hoverBackgroundColor="#0D90EE"
                    hoverBorderColor="#0D90EE"
                    text="확 인"
                />
            )}

            {type === 2 && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '400px',
                    }}
                >
                    <Button
                        onClick={handleConfirm}
                        width="190px"
                        height="50px"
                        borderRadius="10px"
                        fontSize="18px"
                        backgroundColor="#59ABE6"
                        hoverBackgroundColor="#0D90EE"
                        text="확 인"
                    />
                    <Button
                        onClick={onRequestClose} // 취소 버튼 동작 개선
                        width="190px"
                        height="50px"
                        borderRadius="10px"
                        fontSize="18px"
                        backgroundColor="#fff"
                        borderColor="#e9e9e9"
                        hoverBackgroundColor="#e9e9e9"
                        hoverBorderColor="#e9e9e9"
                        color="#000"
                        hoverColor="#000"
                        text="취 소"
                    />
                </div>
            )}
        </Modal>
    );
};

export default CommonModal;
