const Footer = () => {
    return (
        <footer className="text-white mt-auto py-4" style={{ backgroundColor: '#313158', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                        <h6 className="m-0 fw-bold" style={{ letterSpacing: '0.5px' }}>FACEBOOK DA WISH</h6>
                    </div>
                    
                    <div className="text-white-50 small text-center text-md-end">
                        <span className="d-block d-md-inline mb-1 mb-md-0">
                            Projeto Académico
                        </span>
                        <span className="mx-2 d-none d-md-inline">•</span>
                        <span>Programação Web e Base de Dados</span>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;