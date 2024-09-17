import './Welcome.css';
import logo512 from '../../assets/logo512.png';

const Welcome = () => {
    return (
        <div className="welcome">
            <h1>Welcome to EquityCats</h1>
            <p>Type <strong>HELP &lt;GO&gt;</strong> for a list of available commands</p>
            <img src={logo512} alt="EquityCats Logo" />
        </div>
    );
}
 
export default Welcome;