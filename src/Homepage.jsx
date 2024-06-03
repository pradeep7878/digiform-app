import CardComponent from './CardComponent';
import Footer from './Footer';
import Header from './Header';


const Homepage = () => {
    return (
        <>
            <section className="homepage">
                <Header />
                <CardComponent />
                <Footer />
            </section>
        </>
    )
}

export default Homepage
