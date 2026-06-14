const Message = ({ variant = 'info', children }) => {
    const colors = {
        danger: { background: '#fdecea', color: '#9a3b28', border: '#f5c6c0' },
        success: { background: '#e9f5ef', color: '#287c84', border: '#b8dfc8' },
        info: { background: '#f2f6e8', color: '#4f8f46', border: '#cde45f' },
    };
    const style = colors[variant] || colors.info;
    return (
        <div style={{
            padding: '14px 18px',
            borderRadius: '8px',
            border: `1px solid ${style.border}`,
            background: style.background,
            color: style.color,
            margin: '12px 0',
        }}>
            {children}
        </div>
    );
};

export default Message;