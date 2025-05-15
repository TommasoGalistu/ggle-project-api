function Section({src, alt, descrizione, sliderObj}){
    return <>
        {!sliderObj &&<section className="sectionSponsor">
            <div>
                <img src={src} alt={alt} />
            </div>
            <div>{descrizione}</div>
        </section>}
        {sliderObj && 
            <div className="cont"> 
                <div className="contSlider">
                    SLIDER
                    <img src={src} alt={alt} />
                </div>
            </div>
            
        }
    </>
}

export default Section;