const Loader = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{
                width: '48px', height: '48px',
                border: '4px solid #dfe6d8',
                borderTop: '4px solid #4f8f46',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default Loader;