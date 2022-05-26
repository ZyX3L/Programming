import './style.css'
import memberJSON from './members.json'
import contestJSON from './contests.json'
import qoutesJSON from './shower_thoughts.json'

type Social = {
  type: string;
  link: string;
} // Probably unnecessary, but ts wont stop bothering me

const member_grid = document.querySelector<HTMLDivElement>('#member_grid')!
const contest_list = document.querySelector<HTMLDivElement>('#contest_list')!
const ctf_intro = document.querySelector<HTMLDivElement>('#ctf_intro')!
const qoute_div = document.querySelector<HTMLDivElement>('#qoute')!

let memberHTML = ``
let contestHTML = ``

function contest_generator(){
  contestJSON.contests.forEach(
    contest => {
      contestHTML += `
                      <div style="margin: 0.5rem; border: 2px solid white; padding: 1rem;border-radius: 1rem; display: inline-block; width: 24rem; height: 10rem;">
                        <b><p class="title">${contest.title}</p></b>
                        <br>
                        ${generate_categories(contest.tags)}
                        <br>
                        <p>By: ${contest.authors}</p>
                      </div>
                      `
    }
  )
  return contestHTML
}

function generate_categories(categories: string[]){
    let categoryHTML = ``
    let color = "red";

    categories.forEach(
      category => {
        categoryHTML += `<span style="margin: 2px; padding: 4px; border-radius: 2px; background-color: ${color}; display: inline-block">
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
    socialHTML += `<a href="${social.link}"><img src="./icons/${icon}" style="padding: 0.2em; width: 1.5rem; height: 1.5rem"></a>`
  });
  return socialHTML
}

function member_generator(){
  memberJSON.members.forEach(
    element => {
      memberHTML += 
        `<div style="margin: 0.5rem; border: 2px solid white; padding: 1rem;border-radius: 1rem; display: inline-block; width: 15rem; overflow-wrap: ellipsis;">
          <img src="${element.image}" style="width: 6rem;border-radius: 3rem">
          <p><b>${element.name}</b></p>
          <p>${generate_categories(element.categories)}</p>
          <p>${element.description}</p>
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
        `<div style="margin: 0.5rem; border: 2px solid white; border-radius: 1rem; display: inline-block; width: 15rem; overflow-wrap: ellipsis; flex-shrink: 0;">
          <img src="${element.image}" style="width: 6rem;border-radius: 3rem; margin-top: 1rem">
          <p><b>${element.name}</b></p>
          <p>${generate_categories(element.categories)}</p>
        </div>`
    }
  )
  return member_group + "</div>"
}

function intro_animation(){
  let i = 1;
  let string = "nd{Y0ur_lov3ly__no0b_CTF_t34m}"
  let n = string.length / 2 // "magic number" used a lot so decided to shorten it to a variable
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
  // let qoutes_loop = setInterval( () => {

  // }
  // )
  let n = Math.floor(Math.random() * qoutesJSON.qoutes.length)
  console.log(n)
  let i = 1

  qoute_div.innerHTML = qoutesJSON.qoutes[n]
 
  function qoute_anim() {
    let interval = setInterval(
        () => {
          i++
          if(qoute_div.getBoundingClientRect().right < 0) {
            qoute_div.style.transform = "translateX(100vh)"
            n = Math.floor(Math.random() * qoutesJSON.qoutes.length)
            console.log(n)
            qoute_div.innerHTML = qoutesJSON.qoutes[n]
            qoute_anim() //Recursively calls itself for the next qoute

            i = 1
            clearInterval(interval) //Stops when qoute exits viewport
          }

          qoute_div.style.transform = `translateX(-${i}px)`
    }, 3)
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
        console.log(group_1.getBoundingClientRect().right)
  }, 20)
}
member_grid.innerHTML = `${basic_member_generator(1)}${basic_member_generator(2)}`
contest_list.innerHTML = `${contest_generator()}`

intro_animation()
animate_qoutes()
animate_members()