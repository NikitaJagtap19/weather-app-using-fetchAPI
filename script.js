const cityInput=document.querySelector(".input-text")
const searchBtn=document.querySelector(".search-btn")
const countryText=document.querySelector(".cityText")
const tempText=document.querySelector(".temp-text")
const weatherCondition=document.querySelector(".weather-condition")
const HumaditityText=document.querySelector(".humidity-value")
const windSpeedText=document.querySelector(".wind-speed-value")
const weatherInfoContainer=document.querySelector(".weather-info-container")
const notFoundContainer=document.querySelector(".not-found-city-container")
const weatherSummaryImg=document.querySelector(".weather-summary-img")
const currentDateText=document.querySelector(".current-date-text")
const weatherSummaryContainer=document.querySelector(".weather-summary-container")
const forecastItemConatiner=document.querySelector(".forecast-item-conatiner")
const apiKey='08b870d17dd976ceecee92cb3e04cdef'


searchBtn.addEventListener("click",()=>{
    if(cityInput.value.trim() != ''){
        updateWeather(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})

cityInput.addEventListener("keydown",(event)=>{
    if(event.key=="Enter" && cityInput.value.trim() != ''){
        updateWeather(cityInput.value)
        cityInput.value=''
        cityInput.blur()

    }
})

function getFechImage(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    if(id <= 804) return 'clouds.svg'
 }

function getFethcCurrentDate(){
    const currentDate= new Date()
    
    const options ={
        weekday:'short',
        day:"2-digit",
        month:'short'
    }
    const formattedDate =currentDate.toLocaleDateString("en-GB",options)
    return formattedDate;
    
}


async function getFetchData(endpoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&units=metric&appid=${apiKey}`
    const response=await fetch(apiUrl)
   return response.json()

}

async function updateWeather(city){
    const weatherData=await getFetchData("weather",city)
    console.log(weatherData)
    if(weatherData.cod !== 200){
        weatherInfoContainer.style.display ="none";
        notFoundContainer.style.display ="block";
        return
    }
    weatherInfoContainer.style.display ="block";
    notFoundContainer.style.display = "none";
    
    const {
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed} }=weatherData

    countryText.textContent=country
    tempText.textContent=Math.round(temp)+"°C"
    weatherCondition.textContent=main
    HumaditityText.textContent=humidity+' %'
    windSpeedText.textContent=speed+" M/S"
    currentDateText.textContent=getFethcCurrentDate();
    weatherSummaryImg.src=`assets/weather/${getFechImage(id)}`
    updateforecastInfo(city)
}

async function updateforecastInfo(city){
    const forecastData=await getFetchData("forecast",city)
    forecastItemConatiner.innerHTML=""
    const TodayDate= new Date().toISOString().split("T")[0]
    
    forecastData.list.forEach(forecastDataItem => {
        if (forecastDataItem.dt_txt.includes("12:00:00") & !forecastDataItem.dt_txt.includes(TodayDate)){
            updateforecastitem(forecastDataItem)
        }
    });

}

function updateforecastitem(forcasteweatherdata){
    const {
        dt_txt:date,
        main:{temp},
        weather:[{id} ]
    }=forcasteweatherdata

    const dateTaken=new Date(date)
    const dateOptions={
        day:"2-digit",
        month:"short"
        }
    const Dateresult=dateTaken.toLocaleDateString("en-GB",dateOptions)
    
    const ConatinerItem=`
    <div class="forecast-item">
    <h5 class="forecast-item-date">${Dateresult}</h5>
    <img src="assets/weather/${getFechImage(id)}" alt="drizzle-img">
    <h5 class="forecast-item-date">${Math.round(temp)+"°C"}</h5>
    </div>`

     forecastItemConatiner.insertAdjacentHTML("beforeend",ConatinerItem)

    


}

