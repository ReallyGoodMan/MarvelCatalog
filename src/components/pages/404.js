import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link } from "react-router-dom"

const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <h2 style={{"textAlign": 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page not found</h2>
            <Link style={{'display': 'block', "textAlign": 'center', 'fontWeight': 'bold', 'fontSize': '24px'}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;