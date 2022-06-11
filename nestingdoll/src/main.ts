import './style.css'
import memberJSON from './members.json'
import contestJSON from './contests.json'
import qoutesJSON from './shower_thoughts.json'
import DOMPurify from 'dompurify';
import showdown from 'showdown'

var converter = new showdown.Converter()

type Social = {
  type: string;
  link: string;
} // Probably unnecessary, but ts wont stop bothering me

let app_state = { page: "main" }

const home_html = `
      <img src="./icons/nd.png" style="width: 20% ;max-width:50%;margin-top:1em">

      <h3 id="ctf_intro">-=≡≡=-</h3>

      <hr>

      <h2>Contests:</h2>
      <div id="contest_list"></div>
      
      <hr>

      <h2>Members:</h2>
      <div id="member_grid"></div>
      
`

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = home_html

let member_grid = document.querySelector<HTMLDivElement>('#member_grid')!
let contest_list = document.querySelector<HTMLDivElement>('#contest_list')!
let ctf_intro = document.querySelector<HTMLDivElement>('#ctf_intro')!
let qoute_div = document.querySelector<HTMLDivElement>('#qoute')!


document.getElementById("home_button")!.addEventListener("click", load_home)
document.getElementById("members_button")!.addEventListener("click", load_members)
document.getElementById("contests_button")!.addEventListener("click", load_contests)
let memberHTML = ``
let contestHTML = ``

function contest_generator(){
  let i = 0
  contestJSON.contests.forEach(
    contest => {
      i++
      contestHTML = `
                      <div class="contest" id="contest_${i}" style="">
                        <b><p class="title">${contest.title}</p></b>
                        <br>
                        ${generate_categories(contest.tags)}
                        <br>
                        <p style="background: none">${contest.date} • Written  by: ${contest.authors}</p>
                      </div>
                      ` + contestHTML
      
    }     
  )
  return contestHTML
}

function contest_onclick_generator(){
  let i = 0
  contestJSON.contests.forEach(
    (contest) => {
      i++
      document.getElementById(`contest_${i}`)!.addEventListener("click", () => {load_contest(contest.path)})
    }
  )
}

function generate_categories(categories: string[]){
    let categoryHTML = ``
    let color = "red";

    categories.forEach(
      category => {
        categoryHTML += `<span style="margin: 0.1rem; padding: 0.3rem; border-radius: 0.2rem; background-color: ${color}; display: inline-block">
                          ${category}
                        </span>`
      }
    )
    return categoryHTML
}

function generate_socials(socials: Social[]){
  let socialHTML = ``
  socials.forEach(social => {
    let icon = ``

    if (social.type == "youtube"){
      icon = "youtube.png"
    }
    if (social.type == "twitter"){
      icon = "twitter.png"
    }
    socialHTML += `<a href="${social.link}"><img src="./icons/${icon}" style="width: 2rem; height: 2rem"></a>`
  });
  return socialHTML
}

function member_generator(){
  memberJSON.members.forEach(
    element => {
      memberHTML += 
        `<div style="margin: 0.5rem; border: 2px solid white; padding: 1rem;border-radius: 1rem; display: inline-block; width: 15rem; height: 20rem; overflow-wrap: ellipsis;">
          <img src="${element.image}" style="width: 6rem;height: 6rem;border-radius: 3rem">
          <p><b>${DOMPurify.sanitize(element.name)}</b></p>
          <p>${DOMPurify.sanitize(generate_categories(element.categories))}</p>
          <p style="overflow-wrap: ellipsis; height: 4.5rem; overflow: none">${DOMPurify.sanitize(element.description)}</p>
          ${generate_socials(element.links)}
        </div>`
    }
  )
  return memberHTML
}

function basic_member_generator(id: number){
  let member_group = `<div id="member_group_${id}" style="inline-block">`
  memberJSON.members.forEach(
    element => {
      member_group += 
        `<div style="margin: 0.5rem; border: 2px solid #555; border-radius: 0rem; display: inline-block; width: 15rem; overflow-wrap: ellipsis; flex-shrink: 0;">
          <img src="${element.image}" style="width: 6rem;height: 6rem;border-radius: 3rem; margin-top: 1rem">
          <p><b>${DOMPurify.sanitize(element.name)}</b></p>
          <p>${DOMPurify.sanitize(generate_categories(element.categories))}</p>
        </div>`
    }
  )
  return member_group + "</div>"
}

function intro_animation(){
  let i = 1;
  let string = "20+ members brokenn out of the loop"
  let n = string.length / 2 // "magic number" used a lot, so decided to shorten it to a variable
  let delay = 50

  let intro_loop = setInterval( () => {
    i++

    if (i > n){
      clearInterval(intro_loop)
    }

    ctf_intro.innerHTML = "-=≡ " + string.substring((n) - i, n) + string.substring((n) + 1, (n) + i) + " ≡=-"
    //ctf_intro.innerHTML = "-=≡" + ctf_intro.innerHTML + "≡=-"
  }, delay)
}

function animate_qoutes(){
  let n = Math.floor(Math.random() * qoutesJSON.qoutes.length)
  let i = 1

  qoute_div.innerHTML = DOMPurify.sanitize(qoutesJSON.qoutes[n])
 
  function qoute_anim() {
    let interval = setInterval(
        () => {
          i++
          if(qoute_div.getBoundingClientRect().right < 0) {
            qoute_div.style.transform = "translateX(100vh)"
            n = Math.floor(Math.random() * qoutesJSON.qoutes.length)
            qoute_div.innerHTML = qoutesJSON.qoutes[n]
            qoute_anim() //Recursively calls itself for the next qoute

            i = 1
            clearInterval(interval) //Stops when qoute exits viewport
          }

          qoute_div.style.transform = `translateX(-${i}px)`
    }, 6)
  }
  qoute_anim()
} 

function animate_members(){
  //This is the most horrible spaghetti code anyone could ever come up with
  //Nevertheless it is the only variation that I managed to hack 
  //together in order to get a working product
  let group_1 = document.querySelector<HTMLDivElement>('#member_group_1')!
  let group_2 = document.querySelector<HTMLDivElement>('#member_group_2')!


  //Counters for each groups "state"
  let i1 = 0
  let i2 = 0

  let interval = setInterval(
    () => {
        //Unexplainable black magic box, REWRITE ASAP
        i1--
        i2++

        group_1.style.left = `${i1}px`
        group_2.style.left = `-${i2}px`

        if(group_1.getBoundingClientRect().right < 0){
          group_1.style.left = `${group_1.offsetWidth + group_1.offsetWidth + group_1.offsetWidth}px`
          i1 = group_1.offsetWidth
        }
        if(group_2.getBoundingClientRect().right < 0){
          group_2.style.left = `${group_2.offsetWidth * 2}px`
          i2 = 0
        }
  }, 20)
}

function load_home(){
  if (app_state.page == "home"){
    return
  }
  app_state.page = "home"
  app.innerHTML = home_html

  member_grid = document.querySelector<HTMLDivElement>('#member_grid')!
  contest_list = document.querySelector<HTMLDivElement>('#contest_list')!
  ctf_intro = document.querySelector<HTMLDivElement>('#ctf_intro')!

  memberHTML = ``
  contestHTML = ``

  member_grid.innerHTML = `${basic_member_generator(1)}${basic_member_generator(2)}`
  contest_list.innerHTML = `${contest_generator()}`

  intro_animation()
  animate_members()
  
}

function load_members(){
  if (app_state.page == "members"){
    return
  }
  app_state.page = "members"
  memberHTML = ``
  app.innerHTML = "<h2>Our beautiful members:</h2>" + member_generator()
  window.scrollTo(0,0); 
}

function load_contests(){
  if (app_state.page == "contests"){
    return
  }
  app_state.page = "contests"
  contestHTML = ``
  app.innerHTML = "<h2>Contests:</h2>" + contest_generator()
  contest_onclick_generator()
  window.scrollTo(0,0); 
}

function load_contest(contest_path){
  if (app_state.page == "contest"){
    return
  }
  app_state.page = "contest"

  fetch("./src/contests/" + contest_path)
    .then(
      response => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        response.blob().then((data) => {
          console.log(data.text);
        });
      }
    )
  app.innerHTML = converter.makeHtml("./src/contests/" + contest_path)
  window.scrollTo(0,0); 
}



member_grid.innerHTML = `${basic_member_generator(1)}${basic_member_generator(2)}`
contest_list.innerHTML = `${contest_generator()}`

contest_onclick_generator()

intro_animation()
animate_qoutes()
animate_members()
