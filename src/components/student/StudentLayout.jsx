import ProtectedRoute from "../common/ProtectedRoute";

export default function StudentLayout({ children }) {
    return (
        <>
            <ProtectedRoute type='student'>
                {children}
            </ProtectedRoute>
        </>
    )
}