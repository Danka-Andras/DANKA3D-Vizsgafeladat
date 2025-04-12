import Navbar from '../Navbar/Navbar';
import '../AboutUs/AboutUs.css'

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <div className='as'>
                <p>Mi egy apa-fia vállalkozás vagyunk, akik szenvedéllyel készítünk és értékesítünk 3D nyomtatott termékeket. Célunk, hogy kreatív és egyedi darabokat hozzunk el vásárlóinknak, miközben családias légkört árasztunk.</p>
                <h2>Elérhetőségeink</h2>
                <p>Email: info@danka3d.com</p>
                <p>Telefon: +36 20 123 4567</p>
            </div>
        </div>
    );
};

export default AboutUs;
