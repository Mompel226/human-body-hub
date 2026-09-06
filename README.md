<div align="center">

<h1>🫀 &nbsp;Human Body Hub</h1>

**Interactive revision for Cambridge IGCSE Biology 0610 — the human body.**

Nine topics live inside one body. Point at a lab and its organs light up where they really
sit; open the lab and work through the topic with questions that mark themselves.

<br>

[![Open the site](https://img.shields.io/badge/▶_Open_the_site-0969DA?style=for-the-badge&logoColor=white)](https://mompel226.github.io/human-body-hub/)
[![Light version](https://img.shields.io/badge/Light_version-218BFF?style=for-the-badge&logoColor=white)](https://mompel226.github.io/human-body-hub/plate.html)

![IGCSE Biology 0610](https://img.shields.io/badge/IGCSE_Biology-0610-3D7A54)
![Free to use](https://img.shields.io/badge/students-no_sign--up_needed-6FA287)
![Marks](https://img.shields.io/badge/teachers-marks_in_Google_Sheets-C9A227)

by **Dr Daniel Mompel Riera** · NLCS Jeju

</div>

![The hub: a body reconstructed from MRI, with the gas exchange system lit](docs/img/hub-3d.png)

---

## 🧭 Where this sits

This is one **shelf** of the [Biology Hub](https://mompel226.github.io/biology-hub/), the front
door to every Biology app at NLCS Jeju. A student goes front door → this shelf → a lab. The
other shelves are [Life on Earth](https://mompel226.github.io/life-on-earth-hub/) (topics 1 and
17–21, live) and Foundations and Plants, being built as their own repositories; this one covers
the human body, topics 7 and 9–16. The link at the top of the page goes back up.

Behind this shelf: the [Digestion Lab](https://mompel226.github.io/digestion-lab/) (Topic 7,
live) and eight more labs being built. Related but separate: the
[Protein & Enzyme Sim](https://mompel226.github.io/protein-enzyme-sim/), which sits on the
Foundations shelf.

## 🧑‍🎓 For your students — there is nothing to set up

> [!TIP]
> **Send them the link and you are done.**
> [mompel226.github.io/human-body-hub](https://mompel226.github.io/human-body-hub/)
>
> No account, no sign-up, no install, nothing to pay. It works on a phone, a Chromebook or
> a school PC, and their progress is saved in their own browser. Anyone in the world is
> welcome to use it.

| # | Topic | Lab | |
|:--:|-------|-----|:--:|
| 7 | Human nutrition | [**Digestion Lab**](https://mompel226.github.io/digestion-lab/) | 🟢 live |
| 9 | Transport in animals | Circulation Lab | ⚪ soon |
| 10 | Diseases and immunity | Immunity Lab | ⚪ soon |
| 11 | Gas exchange in humans | Gas Exchange Lab | ⚪ soon |
| 12 | Respiration | Respiration Lab | ⚪ soon |
| 13 | Excretion in humans | Excretion Lab | ⚪ soon |
| 14 | Coordination and response | Coordination Lab | ⚪ soon |
| 15 | Drugs | Drugs & AMR Lab | ⚪ soon |
| 16 | Reproduction | Reproduction Lab | ⚪ soon |

<table>
<tr>
<td width="50%" valign="top">

**🩻 The 3D body** — `index.html`

Reconstructed from a real MRI scan. Turn it, zoom, and peel back skin, skeleton and muscle
to reach what lies underneath. 6 MB.

</td>
<td width="50%" valign="top">

**🗺️ The light version** — `plate.html`

The same nine topics on a flat anatomical plate. 1.5 MB, loads instantly, and works from a
memory stick. For a slow connection.

</td>
</tr>
</table>

![The light version: a flat anatomical plate with the circulatory system lit](docs/img/hub-plate.png)

<div align="center">

*Every question marks itself and tells the student which parts are wrong — never the answer.
They keep going until it is right.*

</div>

---

<div align="center">

## 📊 Would you like to see how your students are doing?

**You can — every score, every class, in one Google Sheet of your own.**
It takes about half an hour, once, and you do not need to know any code.

</div>

One Google Sheet with a tab per lab. Each tab is your class list: every student has a row from
the moment you import them from Google Classroom, and handing in fills theirs in — score,
percentage, how many checks it took, how many they got right first time, how long they worked.

<table>
<tr><td colspan="2" align="center">

**🧑‍🎓 Your student works through a lab &nbsp;→&nbsp; presses Hand in &nbsp;→&nbsp; signs in with Google**

</td></tr>
<tr>
<td width="50%" valign="top">

#### ✅ &nbsp;On your class list

Their row fills in on **your** Sheet — score, percentage, and the work behind it.

</td>
<td width="50%" valign="top">

#### 🌍 &nbsp;Anyone else in the world

**Nothing is saved, anywhere.** No row, no name, no email. They still get their code.

</td>
</tr>
</table>

> [!IMPORTANT]
> **The labs stay open to everyone.** A hand-in is recorded **only** when the Google account
> that signed in is on your class list. For everybody else nothing is written down at all —
> no row, no name, no email. That decision is made on the server, so it holds.

<details>
<summary><h3>👉 &nbsp;Open this to set it up — step by step</h3></summary>

<br>

### Before you start

You will need three things, all free:

| | |
|:--:|---|
| 🐙 | **A GitHub account** — [github.com/signup](https://github.com/signup). This is where your own copy of the lab will live. |
| 📗 | **A Google account** — your school one. It holds the spreadsheet. |
| 🏫 | **Google Classroom** with your classes in it, so the student names import themselves. |

---

### Step 1 · Make your own copy of the lab 🐙

> ### ⚠️ &nbsp;The step people skip
> **Nothing works without it.** If you share *my* link with your students, their hand-ins go
> to *my* script — and since they are not on my class list, nothing is saved for anyone. You
> need your own copy, at your own web address, pointing at your own spreadsheet.

You do not need to know GitHub. It is three clicks and one edit.

| # | Do this |
|:--:|---|
| **1** | Go to **[github.com/Mompel226/digestion-lab](https://github.com/Mompel226/digestion-lab)** and press **Fork** (top right) ▸ **Create fork**. You now have your own copy. |
| **2** | In *your* copy: **Settings ▸ Pages**. Under *Branch* choose **master**, folder **/ (root)**, **Save**. Wait a minute or two. |
| **3** | Your lab is now live at **`https://YOUR-USERNAME.github.io/digestion-lab/`**. Open it and check it loads. Write that address down — you need it twice below. |

*(To change a file in your copy: open it on GitHub, press the **✏️ pencil**, edit, then
**Commit changes**. That is all the GitHub you need.)*

#### Do you want the hub as well?

The hub — the body you point at to choose a lab — is only a signpost. **No marks pass through
it**, so you can skip this entirely and just give your students your lab link. But if you want
the whole thing under your own name, and you want it pointing at *your* labs rather than mine:

| # | Do this |
|:--:|---|
| **a** | Fork **[Mompel226/human-body-hub](https://github.com/Mompel226/human-body-hub)** the same way. |
| **b** | In your fork: **Settings ▸ Pages** ▸ branch **main** ▸ **Save**. It goes live at `https://YOUR-USERNAME.github.io/human-body-hub/`. |
| **c** | Open **`js/topics.js`**, press the ✏️ pencil, and change every `url:` to your own fork's address — `https://YOUR-USERNAME.github.io/digestion-lab/` and so on for each lab you host. **Commit changes.** |
| **d** | Share **your** hub link with your classes. |

> ⚠️ &nbsp;**If you skip step c**, your hub will send your students to *my* labs, which post to
> *my* spreadsheet — and since they are not on my class list, nothing is saved for anybody. The
> `url` in `js/topics.js` is the only thing that decides where a student ends up.

---

### Step 2 · Build the spreadsheet 📗

| # | Do this |
|:--:|---|
| **4** | Make a **new Google Sheet**. The name does not matter. |
| **5** | In it: **Extensions ▸ Apps Script**. Delete whatever is there and paste in **[`Code.gs`](apps-script/Code.gs)** — open that file and use GitHub's copy button, or take it from [the copy at the bottom of this page](#-the-two-files-to-paste). |
| **6** | Press **+** beside *Files* ▸ **HTML** ▸ name it exactly `ClassroomImport` ▸ paste in **[`ClassroomImport.html`](apps-script/ClassroomImport.html)**. Save. |
| **7** | In the left sidebar, beside **Services**, press **+** ▸ choose **Google Classroom API** ▸ **Add**. Leave the identifier as `Classroom`. |
| **8** | **Run ▸ `setup`**, and authorise when asked — it is your own script, on your own Sheet. It builds and formats every tab. |

> 💡 &nbsp;**There is no id to paste anywhere.** The script sits inside your Sheet, so it
> works out which one it is the first time you run it, and remembers.

---

### Step 3 · Switch on sign-in 🔑

Signing in is how the spreadsheet tells *your* students from the rest of the world, so
**nothing at all is recorded until this is done.** It is the fiddliest step; take it slowly.

A **Client ID** is a name-tag for your app, issued by Google. It is not a password and not a
secret — it sits in plain sight in the page. One long string ending
`.apps.googleusercontent.com`, and it goes in **two places, the same string in both**.

| # | Do this |
|:--:|---|
| **9** | Go to **[console.cloud.google.com](https://console.cloud.google.com)** and pick a project, or make one — any name, it is just a container. |
| **10** | In the search bar type **Google Auth Platform** and open it. On a new project it shows **Get started** and walks you through four short screens: **App information** (an app name, and your own email as the support email) ▸ **Audience** — choose **External** ▸ **Contact information** (your email again) ▸ agree and **Create**. Nothing here is public unless you publish it, and none of it needs a website or a privacy policy. |
| **11** | Now in the left-hand menu: **Audience ▸ Publish app** ▸ confirm. It should read **In production**, not *Testing*. |
| **12** | Left-hand menu: **Clients ▸ Create client** *(the older console calls this **APIs & Services ▸ Credentials ▸ Create credentials ▸ OAuth client ID** — both land in the same place)*. **Application type: Web application**. Give it any name. |
| **13** | Under **Authorised JavaScript origins** press **+ Add URI** and enter exactly **`https://YOUR-USERNAME.github.io`** — your address from step 3, **no path, no trailing slash, no `/digestion-lab`**. Leave **Authorised redirect URIs** completely empty. Press **Create** and copy the **Client ID** (it ends `.apps.googleusercontent.com`). |

> ### ⚠️ &nbsp;Three things that catch people out here
> **Step 10 must come before step 12.** Google will not issue a client id until the consent
> screen exists — go straight to *Create client* and it bounces you back.
>
> **Step 11 is not optional.** Left on *Testing*, only accounts you list by hand can sign in
> and everyone else is told *“access blocked: this app has not completed verification”*.
> Publishing needs no review here: signing in asks for a name and an email address only, which
> Google counts as **non-sensitive** — so there is no waiting and nothing to submit.
>
> **The origin has no path.** `https://YOUR-USERNAME.github.io` — not
> `https://YOUR-USERNAME.github.io/digestion-lab/`, and no trailing slash. Google matches the
> origin exactly, and the commonest failure is a sign-in button that appears and then does
> nothing.
>
> *Google redesigns this console fairly often. If a screen does not look like the above, the
> three things you are looking for are always the same: a **consent screen / Branding** page,
> an **Audience** page with a **Publish** button, and a **Clients / Credentials** page that
> makes a **Web application** client.*

---

### Step 4 · Join the two together 🔗

| # | Do this |
|:--:|---|
| **14** | In the Apps Script editor, paste your Client ID into **`CLIENT_ID`** at the very top of `Code.gs`. |
| **15** | **Deploy ▸ New deployment ▸ Web app.** *Execute as* **Me**, *Who has access* **Anyone**. Press **Deploy** and copy the **`/exec` URL**. |
| **16** | In **your fork** of the lab, open **`js/config.js`**, press the ✏️ pencil, and fill in two lines — `submitUrl:` your `/exec` URL, and `googleClientId:` the same Client ID as step 14. **Commit changes.** |

> ### 🔁 &nbsp;Remember this one for ever
> **Every time you edit the script from now on:** Deploy ▸ Manage deployments ▸ **✏️ pencil**
> ▸ *Version* ▸ **New version** ▸ Deploy. Editing alone changes nothing. Use the pencil rather
> than *New deployment* and the URL stays the same, so you never touch `config.js` again.

---

### Step 5 · Bring your classes in, and test it 🎓

| # | Do this |
|:--:|---|
| **17** | In your Sheet: **🧪 Biology Labs ▸ Import students from Classroom…** Tick your courses, check the class codes it guesses, **Import**. Every lab tab fills with names. |
| **18** | Open **your** lab link, answer one question, press **Hand in**, and sign in as yourself. |

If you are on the Students tab, your row fills in. If you are not — you are the teacher, after
all — nothing is saved, which is the system working. Add yourself to the **Students** tab by
hand to try it: unhide the *School email* column, and type your name, a class and your email
into an empty row.

> ### ✅ &nbsp;From now on, share your own link
> `https://YOUR-USERNAME.github.io/digestion-lab/` — not mine. That is the one wired to your
> spreadsheet.

---

### When something is wrong 🩺

Start with **🧪 Biology Labs ▸ Check the set-up**. It says in one box whether the Sheet is
found, whether Classroom is switched on and authorised, **whether sign-in is set up**, and how
much is in there.

| What you see | What it means |
|---|---|
| `Script function not found: …` | the pasted script is older than its menu — re-paste [`Code.gs`](apps-script/Code.gs) in full |
| `Classroom is not defined` | step 7 was missed — Services ▸ + ▸ Google Classroom API ▸ Add, then run `setup` |
| `Illegal spreadsheet id or key: …` | the **deployment** is older than the editor — redeploy with the ✏️ pencil, *New version* |
| the import window lists no courses | that Google account has no **active** Classroom courses |
| no sign-in button on the lab | `googleClientId` is empty in your fork's `js/config.js` |
| `access blocked: this app has not completed verification` | step 11 was missed — Audience ▸ **Publish app** |
| sign-in works, but nothing reaches the Sheet | `CLIENT_ID` is empty, is a different string from `googleClientId`, or the deployment is stale |
| a lab's tab has no names in it | nobody has been imported yet — step 17 |
| everything is set up, but **no** student appears | you shared my link, or your hub's `js/topics.js` still points at my labs. Your students must open **your** address — `https://YOUR-USERNAME.github.io/digestion-lab/` |
| a stranger signs in and nothing is recorded | working as intended 🌍 |

</details>

---

## 🗂️ Once it is running — what you actually do

<details>
<summary><b>What each tab holds</b></summary>

<br>

| Tab | What is in it |
|---|---|
| 🟢 **Students** | the dashboard — every student, their class, and their best score in **every** lab, red through amber to green |
| 🟢 **Digestion**, **Circulation**, … | one tab per lab, and each is your class list again: a row per student from the moment they are imported |
| 🟡 **Labs** | one row per lab: how many questions it has, how many hand-ins it has had |
| 🟡 **Setup** | what everything is, your web app URL, and the tick-box buttons |
| 🔴 **Rejected** | a hand-in from one of your students whose numbers did not add up, with the reason |

Every tab explains itself: hover a heading to see what the column is for. A **dark green
heading** is filled in for you; an **amber heading with a ✎** is yours to change.

**Importing a class formats everything** — there is nothing to press afterwards. Run the
import again whenever somebody joins: students are keyed on their school email, so it adds
the new ones, moves anyone whose class changed, and never duplicates.

**Handing in twice is fine and does not make a second row.** *Hand-ins* counts the goes and
*Last hand-in* always moves, but the score is replaced only when the new attempt **beat** the
old one — a careless re-run cannot wipe out a good result.

</details>

<details>
<summary><b>What is on the menu</b></summary>

<br>

| 🧪 Biology Labs ▸ | What it does |
|---|---|
| **Import students from Classroom…** | the main one. Adds new students, then builds and formats everything |
| **Check the set-up** | is the Sheet found, is Classroom on and authorised, is sign-in set up |
| **Refresh everyone's progress** | re-reads the lab tabs into the dashboard |
| **Tidy up** | rebuild anything missing and re-apply the formatting |

All but the import also sit as tick-box buttons on the **Setup** tab; the import opens a
window, which a spreadsheet button is not allowed to do.

</details>

<details>
<summary><b>Reading a completion code</b></summary>

<br>

Every hand-in shows the student a **completion code** — `DL-3CL9-Q3MP`. It is a checksum of
their name, class, score and the lab, and **nothing about it is stored anywhere**. Paste one
into the *Check a completion code* cell on the **Setup** tab and tick the box beside it.

Clear that cell and the answer clears with it, ready for the next one — an answer belongs to
the code that produced it, and a stale one you cannot tell is stale is worse than none.

Because nothing is stored, the only way to read a code is to try the possibilities against a
bounded list of names — and the only such list is your **Students** tab. So:

* a code from **one of your students** resolves to their name, their score, and whether their
  hand-in actually arrived;
* a code from **anyone else in the world** cannot be resolved at all. Their name could be
  anything, so it says so rather than guessing.

It looks the code up first — every hand-in that arrived wrote its code into the lab's tab, so
there is nothing to guess at. Only if it is not there does it start trying possibilities, which
is the case it exists for: the hand-in that **did not** arrive (they were offline, closed the
tab, or could not sign in but still have their code), and telling a real code from an invented
one.

> ⚠️ &nbsp;**A code is made from the name on the GOOGLE account**, not the name on your
> Students tab. For a student imported from Classroom those are the same, so this never comes
> up. But if you type a name in by hand — `Daniel` where Google says `Daniel Mompel Riera` —
> a code that never reached the Sheet cannot be reconstructed. Once that student has handed in
> once, the Google name is remembered and it works from then on.

</details>

<details>
<summary><b>Why “Who has access: Anyone” is safe</b></summary>

<br>

It has to be *Anyone*, because the labs are ordinary web pages with no login: the student's
browser posts to the script as a stranger. *Anyone with a Google Account* makes the browser
follow a sign-in redirect instead, and the hand-in never arrives.

It does **not** share your spreadsheet. Nobody gets access to the Sheet, to Classroom or to
your Drive. The URL exposes exactly two things: a **GET** that says the endpoint is running,
and a **POST** that can fill in one row — and only for a signed-in account on your Students
tab. A stranger with the URL cannot write anything, and cannot read a single mark.

A hand-in from one of your own students that does not add up — a completion code that does not
recompute, a score above the total — goes to the **Rejected** tab with the reason, never into
a lab's tab. And a forged row usually looks forged: 113/113 in 113 checks, 0 right first time,
"0 min" since starting. Sort by *Checks* and it stands out.

To collect nothing at all, leave `submitUrl` or `googleClientId` empty: everyone gets a
completion code on screen and nothing is posted anywhere.

</details>

<details>
<summary><b>Pushing marks into Google Classroom</b></summary>

<br>

Classroom only lets a script grade work that **the same script created** — an assignment made
by hand in the Classroom UI cannot be graded through the API. So either set an assignment
asking for the completion code the lab shows (no setup), or let the script make it:

```javascript
createAssignmentFor('digestion-lab', 'YOUR_COURSE_ID')                 // once
pushGradesFor('digestion-lab', 'YOUR_COURSE_ID', 'THE_COURSEWORK_ID')  // after a test
```

`pushGradesFor` takes each student's best score and matches it to the Classroom roster on
school email. Anyone who has not handed in is skipped rather than given a zero; anyone it
cannot match is left alone and named in the log.

</details>

---

## 📋 The two files to paste


<details>
<summary><b>Code.gs</b> — the whole script (also at <a href="apps-script/Code.gs">apps-script/Code.gs</a>)</summary>

```javascript
/**
 * Biology Labs — one spreadsheet for every lab
 * ============================================
 * Copyright (c) 2025-2026 Daniel Mompel Riera. All rights reserved.
 *
 * What this does
 *   • Collects hand-ins from every Biology Lab into one Sheet, a tab per lab.
 *   • Imports your Google Classroom rosters, so the marks sit next to real names
 *     and classes. Re-run it whenever someone joins: it adds, never duplicates.
 *   • Keeps only your own students: a hand-in is recorded when the Google account that
 *     signed in is on your roster, and ignored when it is not. The labs are public, so
 *     anyone may use them — their work simply does not land here.
 *   • Formats every tab so it is readable: nothing truncated, nothing too narrow,
 *     frozen headers, filters, banding. Re-apply it any time from the menu.
 *
 * SET UP  (five minutes, once, for all nine labs)
 *   1. Make one new Google Sheet. The name does not matter.
 *   2. From that Sheet: Extensions ▸ Apps Script. Delete what is there, paste this file in.
 *      You do NOT need to paste any id: the script is inside the Sheet, so it works out
 *      which one it is the first time you run it, and remembers.
 *      Then + (next to Files) ▸ HTML ▸ name it exactly  ClassroomImport
 *      and paste apps-script/ClassroomImport.html into it. Save.
 *   4. Services (+) ▸ Classroom ▸ Add.        (needed for the roster import)
 *   5. Run ▸ setup. Authorise when asked. It builds and styles every tab.
 *   6. Deploy ▸ New deployment ▸ Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, copy the /exec URL, and paste it into each lab's js/config.js
 *      as submitUrl. One URL, all labs.
 *
 * AFTER ANY EDIT to this file: Deploy ▸ Manage deployments ▸ pencil ▸
 * Version: New version ▸ Deploy. Editing alone changes nothing.
 */

var SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

/* Every lab that can hand in. `id` is what the site sends as `app`; `tab` is the
   tab it is written to. Add a row here (or in the Labs tab) as each lab is built. */
var LABS = [
  { id:'digestion-lab',     name:'Digestion',        topic:'7 · Human nutrition',       questions:113 },
  { id:'circulation-lab',   name:'Circulation',      topic:'9 · Transport in animals',  questions:0 },
  { id:'immunity-lab',      name:'Immunity',         topic:'10 · Diseases and immunity',questions:0 },
  { id:'gas-exchange-lab',  name:'Gas exchange',     topic:'11 · Gas exchange',         questions:0 },
  { id:'respiration-lab',   name:'Respiration',      topic:'12 · Respiration',          questions:0 },
  { id:'excretion-lab',     name:'Excretion',        topic:'13 · Excretion',            questions:0 },
  { id:'coordination-lab',  name:'Coordination',     topic:'14 · Coordination',         questions:0 },
  { id:'drugs-lab',         name:'Drugs & AMR',      topic:'15 · Drugs',                questions:0 },
  { id:'reproduction-lab',  name:'Reproduction',     topic:'16 · Reproduction',         questions:0 }
];

var T_SETUP = 'Setup', T_LABS = 'Labs', T_STUDENTS = 'Students', T_REJECTED = 'Rejected';

/* A lab's tab, described once. Every student gets a row when they are imported; the
   columns after Class stay empty until they hand in. */
var LAB_COLS = [
  { h:'Name', w:200, note:'From the Students tab. Everyone gets a row here when they are imported, whether they have handed in or not. To correct a name, correct it there.' },
  { h:'Class', w:80, align:'center', note:'From the Students tab. Move somebody between classes there and it follows them into every lab.' },
  { h:'Score', w:76, align:'center', fmt:'0', group:true, note:'Their best score in this lab. Blank means they have not handed in yet.' },
  { h:'Out of', w:76, align:'center', fmt:'0', note:'How many questions the lab asked.' },
  { h:'%', w:78, align:'center', fmt:'0.0%', note:'Their best score as a percentage.' },
  { h:'Finished?', w:104, align:'center', list:['complete', 'progress'],
    note:'complete — every question right.\nprogress — handed in part way, to show the work so far.' },
  { h:'Checks', w:86, align:'center', fmt:'0', group:true, note:'How many times they pressed Check answer, in all. This is the evidence of the work.' },
  { h:'Right first time', w:124, align:'center', fmt:'0', note:'How many questions they got right at the first attempt. Separates knowing it from working it out.' },
  { h:'Working since', w:116, align:'center', note:'How long before their best hand-in they first checked anything.' },
  { h:'Hand-ins', w:90, align:'center', fmt:'0', group:true, note:'How many times they have handed this lab in. A second hand-in updates the row rather than adding one.' },
  { h:'Last hand-in', w:132, fmt:'dd MMM, HH:mm', note:'When they last handed in — even if an earlier one scored higher.' },
  { h:'Code', w:126, align:'center', group:true, note:'The completion code from their best hand-in.' },
  { h:'Flags', w:230, note:'Anything worth a second look.' },
  { h:'Per station', w:460, note:'Their score at each station, and how many checks it took there.' },
  { h:'School email', w:230, hide:true, note:'What ties this row to the student. Do not edit.' },
  { h:'Signed in as', w:200, hide:true, note:'The name on the Google account they signed in with. Their completion code is made from THIS name, not the one on the Students tab — which is why it is kept.' }
];
var LAB_EMAIL = 15;
var LAB_GNAME = 16;        /* the column that ties a row to a person */

/* ---- Signing in ----------------------------------------------------------
   The labs are public web pages: anyone in the world can open one, work through it and
   press Hand in. That is the point — but their work must not land in your spreadsheet.
   So a hand-in is kept only when the Google account that signed in is on your Students
   tab. Everyone else gets their completion code on screen and nothing is written down.

   A Client ID is a name-tag for your app, issued by Google. It is not a secret — it sits
   in plain sight in the page source. The lab page uses it to ask Google for a sign-in; this
   script uses it to check the token it gets back was made for YOUR app and not somebody
   else's. Same string in both places, or nothing is recorded.

   To get one (about five minutes, free):
     console.cloud.google.com ▸ pick or make a project
     ▸ Google Auth Platform ▸ Branding — fill this in FIRST, Google will not issue an id
       without it. User type External, then Audience ▸ Publish app. Left on "Testing",
       your students are told the app is blocked.
     ▸ Credentials ▸ Create credentials ▸ OAuth client ID ▸ Web application
       Authorised JavaScript origins:  https://mompel226.github.io
       (no path, no trailing slash. Leave redirect URIs empty.)
     Create, then copy the Client ID (it ends .apps.googleusercontent.com) into BOTH
     places: here, and googleClientId in every lab's js/config.js.
     The full version of this is in the README, under "Sign-in: what the Client ID is".

   Leave it empty and nothing is recorded at all — the labs still work, and everyone gets
   a completion code to hand in by other means.
   -------------------------------------------------------------------------- */
var CLIENT_ID = '';

/* House colours, so the Sheet looks like the labs it collects. */
var INK = '#14572B', INK_SOFT = '#E4EFE7', LINE = '#C9D8CD', WARN = '#B8860B', BAD = '#B03A2E';

/* ============================================================
   The menu
   ============================================================ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧪 Biology Labs')
    .addItem('🎓  Import students from Classroom…', 'showClassroomImport')
    .addItem('🩺  Check the set-up', 'checkSetup')
    .addSeparator()
    .addItem('📊  Refresh everyone\'s progress', 'refreshDashboard')
    .addItem('🎨  Tidy up  (rebuild anything missing, re-apply the formatting)', 'setup')
    .addToUi();
}

/* ============================================================
   1. Receiving a hand-in
   ============================================================ */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var lab = _labById(String(d.app || ''));
    if (!lab) return _text('unknown lab');

    /* Only this teacher's students are recorded. Anyone else in the world who works through
       a lab and presses Hand in gets their completion code and leaves no trace here at all —
       no row, no name, no email, nowhere. */
    if (!CLIENT_ID) return _text('not recorded: sign-in is not set up');
    var who = _whoIs(d.token);
    if (!who) return _text('not recorded: not signed in');
    var student = _studentOf(who.email);
    if (!student) return _text('not recorded: not on this class list');

    var score = Number(d.score) || 0, total = Number(d.total) || 0;

    /* the code was made in the page from what it showed, so it is checked against that */
    var genuine = (_code(lab.id, String(d.name || '').trim(), String(d.form || '').trim(),
                         score + '/' + total) === String(d.code || ''));
    var wrong = [];
    if (!genuine) wrong.push('code does not match');
    if (score > total) wrong.push('score above the total');
    if (total < 0 || total > 1000) wrong.push('impossible total');
    if (wrong.length) {
      _reject(lab, [new Date(), lab.id, student.name, student.cls, score, total, d.code || '',
                    wrong.join('; '), JSON.stringify(d).slice(0, 2000)]);
      return _text('rejected: ' + wrong.join('; '));
    }

    var flags = [];
    if (lab.questions && total !== lab.questions) flags.push('NOT ALL QUESTIONS');
    if (d.complete === false) flags.push('PROGRESS — not finished');

    /* Their row is already waiting, put there when the class was imported. A hand-in fills
       it in; a second hand-in updates it rather than adding another. The count and the date
       always move, and everything else is replaced only when this attempt beat the last one,
       so a worse re-run can never wipe out a better score.
       A whole class can press Hand in within the same few seconds, so the read-then-write is
       done one at a time. _rowFor only has to make a row for somebody who joined since. */
    var lock = LockService.getScriptLock();
    try { lock.waitLock(20000); } catch (e) { return _text('busy — please press Hand in again'); }
    try {
      var sh = _labSheet(lab);
      var r = _rowFor(sh, who.email, student);
      var best = Number(sh.getRange(r, 3).getValue());
      var beaten = !(best > 0) || score > best;
      var seen = Number(sh.getRange(r, 10).getValue()) || 0;

      sh.getRange(r, 1, 1, 2).setValues([[student.name, student.cls]]);
      sh.getRange(r, LAB_GNAME).setValue(who.name || '');
      sh.getRange(r, 10, 1, 2).setValues([[seen + 1, new Date()]]);
      if (beaten) {
        sh.getRange(r, 3, 1, 7).setValues([[
          score, total, total ? score / total : 0,
          d.complete === false ? 'progress' : 'complete',
          Number(d.checks) || '', Number(d.firstTime) || '', _since(d.from)
        ]]);
        sh.getRange(r, 12, 1, 3).setValues([[d.code || '', flags.join('; '), _stations(d.stations)]]);
      }
      _dressRows(sh, LAB_COLS, r, 1);       /* so a row written between tidy-ups still reads properly */
      SpreadsheetApp.flush();
      return _text(beaten ? 'recorded' : 'recorded (an earlier hand-in still scores higher)');
    } finally { lock.releaseLock(); }
  } catch (err) {
    return _text('error: ' + err);
  }
}

/* Junk, and anything that does not verify, lands here instead of in a lab's tab. */
/* Who is this? Google signed the token; we ask Google to check its own signature. The
   answer is cached briefly so two hand-ins in a row do not ask twice. Anything we cannot
   stand behind comes back null. */
function _whoIs(idToken) {
  if (!CLIENT_ID || !idToken) return null;
  var cache = CacheService.getScriptCache();
  var key = 'ID_' + Utilities.base64EncodeWebSafe(
              Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, idToken)).slice(0, 40);
  var hit = cache.get(key);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }

  var res;
  try {
    res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' +
                            encodeURIComponent(idToken), { muteHttpExceptions: true });
  } catch (e) { return null; }
  if (res.getResponseCode() !== 200) return null;

  var t;
  try { t = JSON.parse(res.getContentText()); } catch (e) { return null; }
  if (String(t.aud) !== CLIENT_ID) return null;               /* a token for somebody else's app */
  if (Number(t.exp) * 1000 < Date.now()) return null;         /* expired */
  if (String(t.email_verified) !== 'true') return null;

  var who = { email: String(t.email || '').toLowerCase(), name: String(t.name || '') };
  cache.put(key, JSON.stringify(who), 240);
  return who;
}

/* What the roster knows about them — and whether they are on it at all. */
function _studentOf(email) {
  if (!email) return null;
  var sh = _sheet(T_STUDENTS), last = sh.getLastRow();
  if (last < 2) return null;
  var EMAIL_COL = 3 + LABS.length + 2;
  var vals = sh.getRange(2, 1, last - 1, EMAIL_COL).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][EMAIL_COL - 1] || '').toLowerCase() === email) {
      return { name: String(vals[i][0] || ''), cls: String(vals[i][1] || '').toUpperCase() };
    }
  }
  return null;
}

function _reject(lab, row) {
  var ss = _ss(), sh = ss.getSheetByName(T_REJECTED);
  if (!sh) {
    sh = ss.insertSheet(T_REJECTED);
    sh.getRange(1, 1, 1, 9).setValues([['When', 'Lab', 'Name', 'Class', 'Score',
                                        'Out of', 'Code', 'Why it was refused', 'What was sent']]);
    _dress2(sh, [
      { h:'When', w:150, fmt:'dd MMM, HH:mm', note:'When it arrived.' },
      { h:'Lab', w:140, note:'Which lab it claimed to come from.' },
      { h:'Name', w:190, note:'The name it carried.' },
      { h:'Class', w:80, align:'center' },
      { h:'Score', w:76, align:'center', fmt:'0' },
      { h:'Out of', w:76, align:'center', fmt:'0' },
      { h:'Code', w:120, align:'center' },
      { h:'Why it was refused', w:240, wrap:true, note:'What did not add up. These never reach a lab\'s tab.' },
      { h:'What was sent', w:460, wrap:true, note:'The whole message, in case you want to look.' }
    ], { tab:'#A3342A' });
  }
  sh.appendRow(row);
}

/* ============================================================
   2. The endpoint — a lab checks it is alive; hand-ins arrive by POST
   ============================================================ */
function doGet() {
  return _text('Biology Labs endpoint is running.');
}



/* "Classroom is not defined" is the advanced service not being switched on. Say so in
   words a teacher can act on, rather than letting a ReferenceError reach the dialog. */
function _needClassroom() {
  if (typeof Classroom !== 'undefined' && Classroom && Classroom.Courses) return;
  throw new Error(
    'Google Classroom is not switched on in this script yet. In the Apps Script editor, ' +
    'in the left sidebar: Services  ▸  + (Add a service)  ▸  Google Classroom API  ▸  Add. ' +
    'Leave the identifier as "Classroom". Then Run ▸ setup once to authorise the new ' +
    'permission, and open this window again.');
}

/* Opens the import window. The menu names this function as a string, so if it is ever
   renamed the menu says "Script function not found" and nothing explains why — which is
   what tools/gastest.js now checks for. */
function showClassroomImport() {
  _needClassroom();
  var html = HtmlService.createHtmlOutputFromFile('ClassroomImport')
    .setWidth(880).setHeight(620);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import students from Google Classroom');
}

function getBatchImportData() {
  _needClassroom();
  var courses = [], page = null;
  do {
    var r = Classroom.Courses.list({ courseStates: ['ACTIVE'], pageSize: 100, pageToken: page });
    (r.courses || []).forEach(function (c) {
      courses.push({
        id: c.id,
        name: c.name || '',
        section: c.section || '',
        display: (c.name || '') + (c.section ? ' · ' + c.section : ''),
        autoClassCode: _guessClass(c.name + ' ' + (c.section || ''))
      });
    });
    page = r.nextPageToken;
  } while (page);

  courses.sort(function (a, b) { return a.display.localeCompare(b.display); });

  /* how many students each class already has here, so the dialog can say so */
  var have = {}, rows = _sheet(T_STUDENTS).getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var cls = String(rows[i][1] || '').toUpperCase();
    if (cls) have[cls] = (have[cls] || 0) + 1;
  }
  return { courses: courses, have: have };
}

function executeBatchImportAll(sels, jobId) {
  _needClassroom();
  var results = [];
  sels.forEach(function (s) { results.push({ status: 'pending' }); });
  _publish(jobId, results, false);

  sels.forEach(function (s, i) {
    try {
      var students = [], page = null;
      do {
        var r = Classroom.Courses.Students.list(s.courseId, { pageSize: 100, pageToken: page });
        (r.students || []).forEach(function (st) {
          students.push({
            name: st.profile.name.fullName,
            email: (st.profile.emailAddress || '').toLowerCase(),
            userId: st.userId
          });
        });
        page = r.nextPageToken;
      } while (page);

      if (!students.length) results[i] = { status: 'empty', added: 0, skipped: 0 };
      else results[i] = _upsertStudents(students, s.classCode, s.courseName, s.courseId);
    } catch (err) {
      results[i] = { status: 'error', error: String(err).slice(0, 120) };
    }
    _publish(jobId, results, false);
  });

  _publish(jobId, results, true);
  /* An import is the first thing anyone does, so it leaves the spreadsheet finished:
     every tab that should exist exists and the whole thing is dressed. Nothing else to
     press. */
  _buildAndStyle();
  return results;
}

function getBatchImportProgress(jobId) {
  var raw = CacheService.getScriptCache().get('BATCH_IMPORT_' + jobId);
  return raw ? JSON.parse(raw) : null;
}
function _publish(jobId, results, done) {
  try {
    CacheService.getScriptCache().put('BATCH_IMPORT_' + jobId,
      JSON.stringify({ results: results, done: done }), 600);
  } catch (e) {}
}

/* Add the ones we do not have; update the class of the ones we do. Never duplicates:
   the key is the school email. */
function _upsertStudents(students, classCode, courseName, courseId) {
  var sh = _sheet(T_STUDENTS);
  var EMAIL_COL = 3 + LABS.length + 2;                  /* Name, Class, the labs, started, average, then email */
  var rows = sh.getDataRange().getValues();
  var seen = {}, rowOf = {};
  for (var i = 1; i < rows.length; i++) {
    var em = String(rows[i][EMAIL_COL - 1] || '').toLowerCase();
    if (em) { seen[em] = true; rowOf[em] = i + 1; }
  }
  var add = [], skipped = 0, moved = 0, now = new Date();
  students.forEach(function (st) {
    if (st.email && seen[st.email]) {
      var r = rowOf[st.email];
      if (String(sh.getRange(r, 2).getValue()).toUpperCase() !== classCode) {
        sh.getRange(r, 2).setValue(classCode); moved++;
      }
      skipped++;
      return;
    }
    add.push([st.name, classCode, st.email, courseName, now, st.userId, courseId]);
  });
  if (add.length) {
    var at = sh.getLastRow() + 1;
    sh.getRange(at, 1, add.length, 2).setValues(add.map(function (a) { return [a[0], a[1]]; }));
    sh.getRange(at, EMAIL_COL, add.length, 5).setValues(add.map(function (a) { return a.slice(2); }));
  }
  /* Their names go into every lab straight away, so each tab reads as a class list with the
     marks still to come, rather than filling up only as people hand in. */
  if (add.length || moved) LABS.forEach(function (l) { _seedLab(l); });
  return { status: 'success', added: add.length, skipped: skipped, moved: moved };
}

/* "Y9 Biology · 9A" → "9A";  "10 Set 2" → "10"; falls back to '' so the dialog asks. */
function _guessClass(s) {
  var t = String(s || '').toUpperCase();
  var m = t.match(/\b(1[0-3]|[7-9])\s*([A-Z])\b/);        /* 9A, 10 B */
  if (m) return m[1] + m[2];
  m = t.match(/\bY(?:EAR)?\s*(1[0-3]|[7-9])\b/);          /* Y9, Year 10 */
  if (m) return m[1];
  return '';
}

/* ============================================================
   4. Marks into Google Classroom
   Classroom only lets a script grade work that the same script created, so the
   assignment has to be made from here. One per lab; the id is kept in Labs.
   ============================================================ */
function createAssignmentFor(labId, courseId) {
  _needClassroom();
  var lab = _labById(labId);
  if (!lab) throw new Error('Unknown lab: ' + labId);
  var work = Classroom.Courses.CourseWork.create({
    title: lab.name + ' Lab — Topic ' + lab.topic.split(' ')[0],
    description: 'Work through every station in the lab, then hand in.',
    materials: [{ link: { url: 'https://mompel226.github.io/' + lab.id + '/' } }],
    workType: 'ASSIGNMENT', state: 'PUBLISHED',
    maxPoints: lab.questions || 100
  }, courseId);
  Logger.log('Created "' + work.title + '" in course ' + courseId + ' — id ' + work.id);
  return work.id;
}

function pushGradesFor(labId, courseId, courseWorkId) {
  _needClassroom();
  var lab = _labById(labId);
  if (!lab) throw new Error('Unknown lab: ' + labId);
  var sh = _ss().getSheetByName(lab.name);
  if (!sh || sh.getLastRow() < 2) throw new Error('Nothing in the ' + lab.name + ' tab yet.');

  /* Match on school email — the same thing the hand-in was recorded against — and fall
     back to the name only for anyone Classroom gives no email for. */
  var byEmail = {}, byName = {}, page = null;
  do {
    var r = Classroom.Courses.Students.list(courseId, { pageSize: 100, pageToken: page });
    (r.students || []).forEach(function (s) {
      var em = String((s.profile || {}).emailAddress || '').toLowerCase();
      if (em) byEmail[em] = s.userId;
      byName[_tidy(s.profile.name.fullName)] = s.userId;
    });
    page = r.nextPageToken;
  } while (page);

  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, LAB_COLS.length).getValues();
  var done = 0, missing = [], waiting = 0;
  rows.forEach(function (row) {
    var score = row[2];
    if (score === '' || score === null) { waiting++; return; }   /* has not handed in yet */
    var name = String(row[0] || ''), email = String(row[LAB_EMAIL - 1] || '').toLowerCase();
    var uid = byEmail[email] || byName[_tidy(name)];
    if (!uid) { missing.push(name); return; }
    var subs = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, courseWorkId, { userId: uid });
    var sub = (subs.studentSubmissions || [])[0];
    if (!sub) { missing.push(name + ' (no submission)'); return; }
    Classroom.Courses.CourseWork.StudentSubmissions.patch(
      { assignedGrade: Number(score), draftGrade: Number(score) },
      courseId, courseWorkId, sub.id, { updateMask: 'assignedGrade,draftGrade' });
    done++;
  });
  var said = 'Graded ' + done + '. Still to hand in: ' + waiting +
             '. Not matched: ' + (missing.join(', ') || 'none');
  Logger.log(said);
  return said;
}

/* Tells you, in one box, which of the five set-up steps are done. */
function checkSetup() {
  var lines = [], id = '', src = '';
  try {
    id = _sheetId();
    src = (SHEET_ID && SHEET_ID !== 'PASTE_YOUR_SHEET_ID_HERE') ? 'from SHEET_ID at the top of Code.gs'
        : 'worked out from this Sheet and remembered — you do not need to paste it';
    lines.push('✅  spreadsheet: ' + src);
  } catch (e) {
    lines.push('❌  ' + e.message);
  }

  var openOk = false, name = '';
  if (id) {
    try { name = SpreadsheetApp.openById(id).getName(); openOk = true; } catch (e) {}
    lines.push((openOk ? '✅' : '❌') + '  ' + (openOk ? 'it opens: “' + name + '”' : 'that id will not open'));
  }

  var clsOk = (typeof Classroom !== 'undefined' && Classroom && Classroom.Courses);
  lines.push((clsOk ? '✅' : '❌') + '  Google Classroom ' + (clsOk ? 'is switched on' :
    'is NOT switched on — left sidebar: Services ▸ + ▸ Google Classroom API ▸ Add (identifier "Classroom")'));
  if (clsOk) {
    try { var n = (Classroom.Courses.list({ courseStates: ['ACTIVE'], pageSize: 5 }).courses || []).length;
          lines.push('✅  it can see your courses (' + n + '+ active)'); }
    catch (e) { lines.push('❌  Classroom is on but not authorised — Run ▸ setup once and accept. (' + e + ')'); }
  }

  /* The one that decides whether anything is recorded at all, so it says so plainly. */
  if (!CLIENT_ID) {
    lines.push('❌  sign-in is NOT set up — CLIENT_ID at the top of this script is empty, so ' +
               'NOTHING is being recorded, however green everything above is. Every hand-in ' +
               'comes back “not recorded: sign-in is not set up”. See “Sign-in: what the ' +
               'Client ID is” in the README.');
  } else if (!/\.apps\.googleusercontent\.com$/.test(CLIENT_ID)) {
    lines.push('❌  CLIENT_ID does not look like a Client ID — it should end ' +
               '.apps.googleusercontent.com. This looks like something else was pasted in.');
  } else {
    lines.push('✅  sign-in is set up (…' + CLIENT_ID.slice(-32) + ')');
    lines.push('•  the SAME id must also be googleClientId in every lab\'s js/config.js, or ' +
               'that lab can never record anything.');
  }

  if (openOk) {
    lines.push('•  students imported: ' + Math.max(0, _sheet(T_STUDENTS).getLastRow() - 1));
    var built = LABS.filter(function (l) { return _ss().getSheetByName(l.name); }).length;
    lines.push('•  lab tabs so far: ' + built + ' of ' + LABS.length);
  }
  lines.push('');
  lines.push('Remember: editing this script changes nothing until Deploy ▸ Manage deployments ▸ pencil ▸ New version ▸ Deploy.');

  SpreadsheetApp.getUi().alert('Biology Labs — set-up', lines.join('\n\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ============================================================
   5. The tabs, and making them readable
   ============================================================ */
/* Everything the spreadsheet needs, in the right order. Safe to run at any time: it
   creates only what is missing and never touches what is in the cells. Both the menu's
   Tidy up and the end of an import call this, so importing a class leaves the whole
   spreadsheet built, dressed and up to date — there is nothing else to press. */
function _buildAndStyle() {
  _sheet(T_SETUP); _sheet(T_LABS); _sheet(T_STUDENTS);
  LABS.forEach(function (l) { _seedLab(l); });     /* every lab: a tab, and a row per student */
  var gone = _ss().getSheetByName('Summary');
  if (gone && gone.getLastRow() < 2) _ss().deleteSheet(gone);      /* the Students tab is the summary now */
  _installButtons();
  restyleAll();
  refreshDashboard();
}

function setup() {
  _buildAndStyle();
  SpreadsheetApp.getActive().toast('Every tab is built and styled.', 'Biology Labs', 6);
}

function restyleAll() {
  _styleSetup(); _styleLabs(); _styleStudents();
  LABS.forEach(function (l) {
    var sh = _ss().getSheetByName(l.name);
    if (sh) _styleLab(sh);
  });
}

/* ------------------------------------------------------------
   One place decides what a tab looks like.

   Each column is described once — its heading, what it is for, whether it is filled
   in for you or yours to edit — and everything else follows from that: a width that
   never makes a heading wrap, a hover note so nobody has to guess what a column is,
   a dropdown wherever the answer is one of a few, and formatting that stops at the
   last row with something in it rather than painting a thousand empty ones.

   COL = { h:heading, w:width, note:hover, fmt:number format, align:, wrap:true,
           edit:true (yours to change), list:[dropdown options], hide:true }
   ------------------------------------------------------------ */
/* The palette. Ordinary numbers stay quiet; strong colour is kept for the few things that
   actually need looking at — a low score, a refused hand-in.
   (Dashboard convention: a muted base, high contrast reserved for the exception.) */
var HDR_AUTO = '#14572B';     /* filled in for you */
var HDR_EDIT = '#8A6A12';     /* yours to change  */
var HDR_SOON = '#5C8A72';     /* a lab that does not exist yet */
var BAND_A   = '#FFFFFF';
var BAND_B   = '#F4F8F5';     /* the faintest green, so banding guides the eye without shouting */
var RULE     = '#D6E2DA';     /* the line between one group of columns and the next */
var LOW      = '#F7D9D5';
var MID      = '#FBEED2';
var HIGH     = '#DDEBDD';
var FONT     = 'Inter';

/* Wide enough that the heading never breaks across two lines. */
function _wide(text, min) {
  var px = Math.ceil(String(text).length * 7.4) + 26;
  return Math.max(min || 64, px);
}

function _dress2(sh, cols, opts) {
  opts = opts || {};
  var n = cols.length;
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  if (sh.getMaxColumns() > n) {
    var spare = sh.getRange(1, n + 1, sh.getMaxRows(), sh.getMaxColumns() - n);
    try { if (spare.isBlank()) sh.deleteColumns(n + 1, sh.getMaxColumns() - n); } catch (e) {}
  }

  /* one typeface, one size, everywhere */
  sh.getRange(1, 1, sh.getMaxRows(), n).setFontFamily(FONT).setFontSize(10);

  /* headings */
  var head = sh.getRange(1, 1, 1, n);
  head.setValues([cols.map(function (c) { return (c.edit ? '✎ ' : '') + c.h; })])
      .setFontWeight('bold').setFontColor('#FFFFFF').setFontSize(10)
      .setVerticalAlignment('middle').setHorizontalAlignment('left')
      .setWrap(false);
  cols.forEach(function (c, i) {
    var cell = sh.getRange(1, i + 1);
    cell.setBackground(c.head || (c.edit ? HDR_EDIT : HDR_AUTO));
    cell.setNote((c.note || '') + (c.edit ? '\n\nYou can change this.' : '\n\nFilled in for you.'));
    sh.setColumnWidth(i + 1, c.w || _wide((c.edit ? '  ' : '') + c.h));
  });
  sh.setRowHeight(1, 30);
  sh.setFrozenRows(1);
  if (opts.freezeCols) sh.setFrozenColumns(opts.freezeCols);

  /* only the rows that have something in them get dressed */
  var last = Math.max(1, sh.getLastRow());
  var rows = last - 1;
  if (sh.getMaxRows() > last + 6) {
    try { sh.deleteRows(last + 7, sh.getMaxRows() - last - 6); } catch (e) {}
  }

  sh.getBandings().forEach(function (b) { b.remove(); });
  var f = sh.getFilter(); if (f) f.remove();
  sh.setHiddenGridlines(true);          /* banding and spacing do this job better than a grid */

  if (rows > 0) {
    var body = sh.getRange(2, 1, rows, n);
    body.setVerticalAlignment('middle').setFontColor('#26332A');
    var band = sh.getRange(1, 1, last, n)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
    try { band.setHeaderRowColor(HDR_AUTO).setFirstRowColor(BAND_A).setSecondRowColor(BAND_B); } catch (e) {}
    sh.getRange(1, 1, last, n).createFilter();
    for (var r = 2; r <= last; r++) sh.setRowHeight(r, 24);

    /* a hairline where one group of columns ends and the next begins */
    cols.forEach(function (c, i) {
      if (!c.group) return;
      sh.getRange(1, i + 1, last, 1)
        .setBorder(null, true, null, null, null, null, RULE, SpreadsheetApp.BorderStyle.SOLID);
    });
  }

  cols.forEach(function (c, i) { if (c.hide) sh.hideColumns(i + 1); });
  _dressRows(sh, cols, 2, rows);
  if (opts.tab) { try { sh.setTabColor(opts.tab); } catch (e) {} }
  return rows;
}

/* The per-column look — number format, alignment, dropdowns — applied to a block of rows.
   _dress2 uses it for the whole sheet; doPost uses it for the single row it has just
   filled in. Without that, a row added after the last tidy-up carries no format at all,
   and a percentage arrives as 0.008849557522 instead of 0.9%. */
function _dressRows(sh, cols, from, rows) {
  if (!rows || rows < 1) return;
  sh.getRange(from, 1, rows, cols.length).setVerticalAlignment('middle').setFontColor('#26332A');
  for (var r = from; r < from + rows; r++) sh.setRowHeight(r, 24);
  cols.forEach(function (c, i) {
    var col = sh.getRange(from, i + 1, rows, 1);
    if (c.fmt) col.setNumberFormat(c.fmt);
    if (c.align) col.setHorizontalAlignment(c.align);
    col.setWrap(!!c.wrap);
    if (c.bold) col.setFontWeight('bold');
    if (c.list && c.list.length) {
      col.setDataValidation(SpreadsheetApp.newDataValidation()
        .requireValueInList(c.list, true).setAllowInvalid(true)
        .setHelpText('One of: ' + c.list.join(', ')).build());
    } else {
      col.setDataValidation(null);
    }
  });
}

/* the classes actually in use, for the dropdowns */
function _classList() {
  var sh = _ss().getSheetByName(T_STUDENTS);
  var out = {}, list = [];
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().forEach(function (r) {
      var v = String(r[0] || '').trim().toUpperCase();
      if (v && !out[v]) { out[v] = 1; list.push(v); }
    });
  }
  list.sort();
  return list;
}

/* The Setup tab is where you press things: the checkboxes are buttons — tick one and it
   runs, then unticks itself. These two constants are the rows those things are written
   on, and must match the `lines` array inside _styleSetup. */
var URL_ROW = 12;
var BTN_ROW = { refresh: 18, restyle: 19, code: 21 };
var CODE_ROW = 21;      /* paste a code in B21; the answer lands in B22 */

function _styleSetup() {
  var sh = _sheet(T_SETUP);
  var url = '';
  try { url = String(sh.getRange(URL_ROW, 2).getValue() || '').trim(); } catch (e) {}
  if (!/^https?:/i.test(url)) url = PropertiesService.getScriptProperties().getProperty('WEB_APP_URL') || '';
  if (!url) url = '(paste your /exec URL here, so you can find it again)';
  sh.clear();
  sh.getBandings().forEach(function (b) { b.remove(); });

  var lines = [
    ['Biology Labs', 'one spreadsheet for every lab'],
    ['', ''],
    ['Students', 'every student, every lab, best score so far. Filter the Class column to see one class.'],
    ['Labs', 'one row per lab: how many questions it has, and how many hand-ins it has had.'],
    ['Digestion, Circulation, …', 'your class list again, one tab per lab. Every student has a row from the moment you import them; handing in fills it in. Handing in twice updates the same row and keeps the better score.'],
    ['Rejected', 'a hand-in from one of your students whose numbers did not add up.'],
    ['', ''],
    ['Only your students land here', 'a hand-in is kept when the Google account that signed in is on the Students tab. The labs are public, so anyone in the world may use them — their work is not recorded anywhere.'],
    ['', ''],
    ['Reading a heading', 'dark green = filled in for you.   ✎ amber = yours to change.   Hover any heading to see what it is for.'],
    ['', ''],
    ['Web app URL', url],
    ['', ''],
    ['Buttons', 'tick one. It unticks itself straight away and gets on with the job — watch the line that appears to the right of it, which stays until you use that button again.'],
    ['', ''],
    ['Import students from Classroom', 'on the 🧪 Biology Labs menu (it opens a window, so it cannot be a checkbox)'],
    ['', ''],
    ["Refresh everyone's progress", ''],
    ['Tidy up — rebuild anything missing, re-apply the formatting', ''],
    ['', ''],
    ['Check a completion code', 'paste a code here, then tick →   (it can only match one of your own students)'],
    ['', ''],
    ['', ''],
    ['If something looks wrong', '🧪 Biology Labs ▸ Check the set-up'],
    ['After editing the script', 'Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy']
  ];
  sh.getRange(1, 1, lines.length, 2).setValues(lines);
  sh.getRange('A1').setFontSize(17).setFontWeight('bold').setFontColor(INK);
  sh.getRange('B1').setFontColor('#6B7B6F');
  sh.getRange(3, 1, lines.length - 2, 1).setFontWeight('bold').setFontColor(INK);
  sh.getRange(14, 1).setFontSize(13);
  sh.getRange(1, 1, lines.length, 2).setVerticalAlignment('middle').setWrap(true);
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 720); sh.setColumnWidth(3, 60);
  sh.setColumnWidth(4, 430);
  for (var r = 1; r <= lines.length; r++) sh.setRowHeight(r, r === 1 ? 34 : 24);

  /* the buttons */
  Object.keys(BTN_ROW).forEach(function (k) {
    var r = BTN_ROW[k];
    sh.getRange(r, 3).insertCheckboxes().setValue(false).setHorizontalAlignment('center');
    sh.getRange(r, 1, 1, 3).setBackground('#EFF5F0');
  });
  sh.getRange(BTN_ROW.refresh, 1, 2, 1).setFontColor(INK);
  sh.getRange(CODE_ROW, 1).setFontColor(INK);
  sh.getRange(CODE_ROW, 2).setBackground('#FFFFFF').setFontColor('#8A8F8A').setFontStyle('italic')
    .setBorder(true, true, true, true, false, false, '#C9A227', SpreadsheetApp.BorderStyle.SOLID);
  sh.getRange(CODE_ROW + 1, 2).setFontColor('#3D7A54').setFontWeight('bold');
  sh.getRange(CODE_ROW + 1, 2).setValue('');       /* no answer until a code is checked */
  sh.setHiddenGridlines(true);
}

/* Ticking a button runs it. Installed by setup(); a simple onEdit could not do this. */
function _installButtons() {
  var have = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'onButtonTicked';
  });
  if (have) return;
  ScriptApp.newTrigger('onButtonTicked')
    .forSpreadsheet(_ss()).onEdit().create();
}

function onButtonTicked(e) {
  if (!e || !e.range) return;
  var sh = e.range.getSheet();
  if (sh.getName() !== T_SETUP) return;

  /* An answer belongs to the code that produced it. Clear or change the code and the answer
     below it has to go, or the next person to look reads an answer to a question nobody
     asked — and you cannot tell whether it is stale until you have already believed it. */
  if (e.range.getRow() === CODE_ROW && e.range.getColumn() === 2) {
    var typed = String(e.range.getValue() || '').trim();
    _codeAnswer(typed ? '↑  Tick the box to check this code.' : '');
    if (!typed) _btnSays(BTN_ROW.code, '');
    return;
  }

  if (e.range.getColumn() !== 3) return;
  if (e.range.getValue() !== true) return;
  var row = e.range.getRow();

  /* The box unticks itself the moment you tick it, and some of these take a while. Without
     something that STAYS on the screen you cannot tell the difference between "it is working"
     and "nothing happened" — a toast is gone in a few seconds, and you may not be looking. So
     the message is written into the sheet beside the button and left there. */
  var started = new Date();
  _btnSays(row, '⏳  Working… started ' + _hhmm(started) + '. Please wait — do not tick again.');
  e.range.setValue(false);
  SpreadsheetApp.flush();

  try {
    var did = '';
    if (row === BTN_ROW.refresh) { refreshDashboard(); did = 'Progress refreshed'; }
    else if (row === BTN_ROW.restyle) { setup(); did = 'Tidied up — every tab rebuilt and reformatted'; }
    else if (row === BTN_ROW.code) { checkCode(); did = 'Code checked — the answer is in the cell below'; }
    else { _btnSays(row, ''); return; }
    var secs = Math.round((new Date() - started) / 1000);
    _btnSays(row, '✅  ' + did + ' at ' + _hhmm(new Date()) + ' (took ' + secs + 's)');
  } catch (err) {
    _btnSays(row, '❌  That did not work: ' + err);
    SpreadsheetApp.getActive().toast('That button failed: ' + err, 'Biology Labs', 30);
  }
}

function _hhmm(d) {
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}

/* The answer under the code box. Grey while it is only a prompt, green when it is a real
   answer, so the two never look alike. */
function _codeAnswer(text) {
  var sh = _sheet(T_SETUP);
  var hint = /^↑/.test(text);
  sh.getRange(CODE_ROW + 1, 2).setValue(text)
    .setFontColor(hint ? '#8A8F8A' : '#3D7A54')
    .setFontWeight(hint ? 'normal' : 'bold')
    .setFontStyle(hint ? 'italic' : 'normal');
}

/* The line beside a button. It stays until that button is used again. */
function _btnSays(row, text) {
  var sh = _sheet(T_SETUP);
  sh.getRange(row, 4).setValue(text)
    .setFontColor(text.indexOf('❌') === 0 ? '#A3342A' : (text.indexOf('⏳') === 0 ? '#7A5B00' : '#265C33'))
    .setFontWeight('bold').setVerticalAlignment('middle').setWrap(false);
}

function _styleStudents() {
  var sh = _sheet(T_STUDENTS);
  var built = {};
  LABS.forEach(function (l) { built[l.id] = !!_ss().getSheetByName(l.name); });

  var cols = [
    { h:'Name', w:210, edit:true,
      note:'The student, as Google Classroom spells it. Correct a spelling here and it follows them into every lab tab the next time you import or Tidy up. Hand-ins are matched by school email, not by this, so a correction cannot lose anybody\'s work.' },
    { h:'Class', w:88, align:'center', bold:true, edit:true, list:_classList(),
      note:'Which class they are in. Used by the filter, and shown on every hand-in.' }
  ];
  LABS.forEach(function (l, i) {
    cols.push({ h:l.name, w:_wide(l.name, 108), align:'center', fmt:'0%', group: i === 0,
                head: built[l.id] ? HDR_AUTO : HDR_SOON,
                note:'Topic ' + l.topic + '.\n\nTheir best score in this lab so far.' +
                     (built[l.id] ? '' : '\n\nThis lab is not built yet, so the column stays empty.') });
  });
  cols.push({ h:'Labs started', w:112, align:'center', fmt:'0', group:true,
              note:'How many of the nine labs they have handed in at least once.' });
  cols.push({ h:'Average', w:94, align:'center', fmt:'0%', bold:true,
              note:'The average of the labs they have started. Labs they have not touched are not counted against them.' });
  cols.push({ h:'School email', w:240, hide:true, note:'From Classroom. This is what stops a student being imported twice.' });
  cols.push({ h:'Classroom course', w:230, hide:true, note:'The course they were imported from.' });
  cols.push({ h:'Imported', w:110, fmt:'dd MMM yyyy', hide:true, note:'When they were first imported.' });
  cols.push({ h:'Classroom user id', w:160, hide:true, note:'Needed to push marks back into Classroom.' });
  cols.push({ h:'Course id', w:140, hide:true, note:'Needed to push marks back into Classroom.' });

  var rows = _dress2(sh, cols, { freezeCols: 2, tab:'#14572B' });
  if (!rows) return;

  var first = 3, L = LABS.length;
  var rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(LOW, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(MID, SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue(HIGH, SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, first, rows, L), sh.getRange(2, first + L + 1, rows, 1)]).build()
  ];
  LABS.forEach(function (l, i) {
    if (built[l.id]) return;
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenCellEmpty()
      .setBackground('#F2F2EF').setRanges([sh.getRange(2, first + i, rows, 1)]).build());
  });
  sh.setConditionalFormatRules(rules);
}

/* The dashboard: every student, every lab, best score so far. Written as values rather than
   formulas, so nothing shows #REF for a lab that has no tab yet — the column is simply empty
   until that lab is used. */
/* The dashboard: every student, every lab, best score so far. Read straight out of each
   lab's tab, which now holds one row per student — so a name is matched by email, not by
   how it was typed. */
function refreshDashboard() {
  var sh = _sheet(T_STUDENTS);
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (!rows) { _styleStudents(); return; }

  var EMAIL_COL = 3 + LABS.length + 2;
  var emails = sh.getRange(2, EMAIL_COL, rows, 1).getValues();
  var rowOf = {};
  emails.forEach(function (r, i) { var e = String(r[0] || '').toLowerCase(); if (e) rowOf[e] = i; });

  var L = LABS.length, first = 3;
  var grid = emails.map(function () { var a = []; for (var i = 0; i < L + 2; i++) a.push(''); return a; });

  LABS.forEach(function (lab, c) {
    var tab = _ss().getSheetByName(lab.name);
    if (!tab || tab.getLastRow() < 2) return;
    var n = tab.getLastRow() - 1;
    var pct = tab.getRange(2, 5, n, 1).getValues();
    var mail = tab.getRange(2, LAB_EMAIL, n, 1).getValues();
    for (var i = 0; i < n; i++) {
      var e = String(mail[i][0] || '').toLowerCase();
      if (!e || !(e in rowOf) || pct[i][0] === '') continue;
      grid[rowOf[e]][c] = Number(pct[i][0]) || 0;
    }
  });

  grid.forEach(function (row) {
    var done = 0, sum = 0;
    for (var c = 0; c < L; c++) if (row[c] !== '') { done++; sum += row[c]; }
    row[L] = done || '';
    row[L + 1] = done ? sum / done : '';
  });

  sh.getRange(2, first, rows, L + 2).setValues(grid);
  _styleStudents();
  SpreadsheetApp.getActive().toast('Progress updated for ' + rows + ' students.', 'Biology Labs', 5);
}


function _styleLabs() {
  var sh = _sheet(T_LABS);
  _dress2(sh, [
    { h:'Lab id', w:170, note:'What the lab\'s own page sends. Do not change it — it has to match js/config.js in that lab.' },
    { h:'Lab', w:130, note:'The name of this lab\'s tab in this spreadsheet.' },
    { h:'Topic', w:200, note:'Which IGCSE topic it covers.' },
    { h:'Questions', w:100, align:'center', fmt:'0', edit:true,
      note:'How many questions that lab has. Used to flag a hand-in that does not cover them all. Fill it in when a lab is built.' },
    { h:'Hand-ins', w:100, align:'center', fmt:'0', note:'How many hand-ins that lab has had. Counted for you.' }
  ], { freezeCols: 2, tab:'#6E8F7C' });
}

function _styleLab(sh) {
  var rows = _dress2(sh, LAB_COLS, { freezeCols: 2, tab:'#3D7A54' });
  if (!rows) return;
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(LOW, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(MID, SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue(HIGH, SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, 5, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('progress')
      .setBackground(MID).setFontColor('#7A5B00')
      .setRanges([sh.getRange(2, 6, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('complete')
      .setBackground(HIGH).setFontColor('#265C33')
      .setRanges([sh.getRange(2, 6, rows, 1)]).build(),
    /* nobody has handed in yet: the row is a name waiting, not a bad mark */
    SpreadsheetApp.newConditionalFormatRule().whenCellEmpty()
      .setBackground('#FAFAF7')
      .setRanges([sh.getRange(2, 3, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0.4)
      .setFontColor('#A3342A').setBold(true)
      .setRanges([sh.getRange(2, 5, rows, 1)]).build()
  ]);
}



/* ============================================================
   6. Plumbing
   ============================================================ */
/* Which spreadsheet this is.
   If the script lives inside the Sheet (Extensions ▸ Apps Script), it works this out on
   its own the first time you run anything from the Sheet, and remembers it — so pasting a
   fresh copy of this file never breaks the deployment. SHEET_ID is only needed for a
   stand-alone script, or to point it at a different Sheet. */
function _sheetId() {
  if (SHEET_ID && SHEET_ID !== 'PASTE_YOUR_SHEET_ID_HERE') return SHEET_ID;
  var props = PropertiesService.getScriptProperties();
  var kept = props.getProperty('SHEET_ID');
  if (kept) return kept;
  var active = SpreadsheetApp.getActiveSpreadsheet();      /* null in a web app; set from the Sheet */
  if (active) { props.setProperty('SHEET_ID', active.getId()); return active.getId(); }
  throw new Error('This script does not know which spreadsheet to use. Open the Sheet and run ' +
                  '🧪 Biology Labs ▸ Check the set-up once — that remembers it — then Deploy ▸ ' +
                  'Manage deployments ▸ pencil ▸ New version ▸ Deploy.');
}
function _ss() { return SpreadsheetApp.openById(_sheetId()); }
function _sheet(name) {
  var ss = _ss(), sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  if (name === T_LABS) {
    sh.getRange(1, 1, 1, 5).setValues([['Lab id', 'Lab', 'Topic', 'Questions', 'Hand-ins']]);
    var rows = LABS.map(function (l, i) {
      return [l.id, l.name, l.topic, l.questions || '',
              '=IFERROR(COUNTA(INDIRECT("\'"&B' + (i + 2) + '&"\'!B2:B")),0)'];
    });
    sh.getRange(2, 1, rows.length, 5).setValues(rows);
  } else if (name === T_STUDENTS) {
    var head = ['Name', 'Class'].concat(LABS.map(function (l) { return l.name; }))
               .concat(['Labs started', 'Average', 'School email', 'Classroom course',
                        'Imported', 'Classroom user id', 'Course id']);
    sh.getRange(1, 1, 1, head.length).setValues([head]);
  }
  return sh;
}
function _labById(id) {
  for (var i = 0; i < LABS.length; i++) if (LABS[i].id === id) return LABS[i];
  return null;
}
/* A lab's tab is the class list for that lab: every student has a row from the moment
   they are imported, empty until they hand in. So you can see at a glance who has done it
   and who has not, rather than waiting for rows to appear. */
function _labSheet(lab) {
  var ss = _ss(), sh = ss.getSheetByName(lab.name);
  if (!sh) {
    sh = ss.insertSheet(lab.name);
    sh.getRange(1, 1, 1, LAB_COLS.length).setValues([LAB_COLS.map(function (c) { return c.h; })]);
  }
  return sh;
}

/* Give every student on the roster a row here, and leave the ones already present alone.
   Safe to run as often as you like — it is keyed on the school email. */
function _seedLab(lab) {
  var sh = _labSheet(lab);
  var roster = _sheet(T_STUDENTS);
  if (roster.getLastRow() < 2) return sh;
  var EMAIL_COL = 3 + LABS.length + 2;
  var people = roster.getRange(2, 1, roster.getLastRow() - 1, EMAIL_COL).getValues();

  var have = {};
  if (sh.getLastRow() > 1) {
    sh.getRange(2, LAB_EMAIL, sh.getLastRow() - 1, 1).getValues()
      .forEach(function (r, i) { var e = String(r[0] || '').toLowerCase(); if (e) have[e] = i + 2; });
  }
  var add = [];
  people.forEach(function (p) {
    var email = String(p[EMAIL_COL - 1] || '').toLowerCase();
    if (!email) return;
    if (have[email]) {                             /* already here: keep the name and class true to the roster */
      var r = have[email], cur = sh.getRange(r, 1, 1, 2).getValues()[0];
      if (cur[0] !== p[0] || cur[1] !== p[1]) sh.getRange(r, 1, 1, 2).setValues([[p[0], p[1]]]);
      return;
    }
    var row = new Array(LAB_COLS.length).fill('');
    row[0] = p[0];                 /* name  */
    row[1] = p[1];                 /* class */
    row[LAB_EMAIL - 1] = email;
    add.push(row);
  });
  if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, LAB_COLS.length).setValues(add);
  return sh;
}
/** "mouth 9/9 in 14 · stomach 8/9 in 21" — readable in one cell. */
/* Where this student's row is, adding one if they arrived after the last import. */
function _rowFor(sh, email, student) {
  var last = sh.getLastRow();
  if (last > 1) {
    var col = sh.getRange(2, LAB_EMAIL, last - 1, 1).getValues();
    for (var i = 0; i < col.length; i++) {
      if (String(col[i][0] || '').toLowerCase() === email) return i + 2;
    }
  }
  var row = new Array(LAB_COLS.length).fill('');
  row[0] = student.name; row[1] = student.cls; row[LAB_EMAIL - 1] = email;
  sh.getRange(last + 1, 1, 1, LAB_COLS.length).setValues([row]);
  return last + 1;
}

function _stations(o) {
  if (!o || typeof o !== 'object') return '';
  return Object.keys(o).map(function (k) { return k + ' ' + o[k]; }).join(' · ');
}
/** "40 min" / "6 h" / "3 days" since the first question was checked. */
function _since(iso) {
  if (!iso) return '';
  var then = new Date(iso);
  if (isNaN(then)) return '';
  var mins = Math.round((new Date() - then) / 60000);
  if (mins < 90) return mins + ' min';
  if (mins < 60 * 36) return Math.round(mins / 60) + ' h';
  return Math.round(mins / 1440) + ' days';
}
/** Must stay identical to completionCode() in each lab's js/app.js. The lab's own id
    is part of the recipe, so a code from one lab cannot be pasted into another. */
/* ============================================================
   5b. Reading a completion code
   ============================================================
   Nothing about a code is written down anywhere. It is a checksum of the name, the class,
   the score and the lab — so the only way to read one back is to try the possibilities and
   see which one matches, and the only bounded list of names you have is your own Students
   tab. That is the whole shape of this feature, and its limit:

     · a code from one of YOUR students resolves to their name and their score;
     · a code from anyone else in the world cannot be resolved at all — their name could be
       anything — and it says so rather than guessing.

   So it is not a lookup. It is for the hand-in that never arrived — the student was offline,
   or closed the tab, or could not sign in — and for telling a real code from an invented one.
   Their result is in the lab's tab already when the hand-in did arrive. */
function checkCode() {
  var sh = _sheet(T_SETUP);
  var code = String(sh.getRange(CODE_ROW, 2).getValue() || '').trim().toUpperCase();
  var say = function (t) { _codeAnswer(t); SpreadsheetApp.getActive().toast(t, 'Completion code', 30); };

  if (!/^[A-Z]{2}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
    return say('Paste a completion code into the cell above, then tick the box. They look like DL-3CL9-Q3MP.');
  }
  /* First, simply look for it. Every hand-in that arrived wrote its code into the lab's tab,
     so there is no need to guess at one that is already sitting there. */
  for (var i = 0; i < LABS.length; i++) {
    var tab = _ss().getSheetByName(LABS[i].name);
    if (!tab || tab.getLastRow() < 2) continue;
    var have = tab.getRange(2, 1, tab.getLastRow() - 1, LAB_COLS.length).getValues();
    for (var j = 0; j < have.length; j++) {
      if (String(have[j][11] || '').trim().toUpperCase() !== code) continue;
      var p = have[j][4] === '' ? '' : ' (' + Math.round(1000 * have[j][4]) / 10 + '%)';
      return say(have[j][0] + ' · ' + have[j][1] + ' · ' + LABS[i].name + ' · ' +
                 have[j][2] + '/' + have[j][3] + p + ' · ' + have[j][5] +
                 '.  Already in the ' + LABS[i].name + ' tab, row ' + (j + 2) + '.');
    }
  }

  var roster = _sheet(T_STUDENTS);
  if (roster.getLastRow() < 2) {
    return say('Import your classes first — a code can only be matched against your own students.');
  }
  var people = roster.getRange(2, 1, roster.getLastRow() - 1, 2).getValues();

  /* Not in any tab, so it is a hand-in that never arrived. Now it has to be guessed at, and
     the guess is over names. A code is made from the name on the GOOGLE account, which for an
     imported student is the same as the one on the Students tab — but not for a name typed in
     by hand. So any Google name already seen on a hand-in is tried as well. */
  var seen = {};
  LABS.forEach(function (l) {
    var t = _ss().getSheetByName(l.name);
    if (!t || t.getLastRow() < 2) return;
    t.getRange(2, LAB_GNAME, t.getLastRow() - 1, 1).getValues().forEach(function (row) {
      var g = String(row[0] || '').trim();
      if (g) seen[g.toLowerCase()] = g;
    });
  });
  Object.keys(seen).forEach(function (k) { people.push([seen[k], '']); });

  /* Signed in, the page sends no class at all; signed out, it sends the one they picked.
     Both are tried, so a code made either way is found. */
  for (var li = 0; li < LABS.length; li++) {
    var lab = LABS[li];
    if (!lab.questions) continue;                 /* a lab with no questions yet issues no codes */
    for (var pi = 0; pi < people.length; pi++) {
      var name = String(people[pi][0] || '').trim();
      if (!name) continue;
      var forms = ['', String(people[pi][1] || '').trim()];
      for (var fi = 0; fi < forms.length; fi++) {
        if (fi === 1 && forms[1] === forms[0]) continue;
        for (var sc = 0; sc <= lab.questions; sc++) {
          if (_code(lab.id, name, forms[fi], sc + '/' + lab.questions) !== code) continue;
          var pct = Math.round(1000 * sc / lab.questions) / 10;
          var where = _rowSaysWhat(lab, name);
          return say(name + ' · ' + lab.name + ' · ' + sc + '/' + lab.questions +
                     ' (' + pct + '%) · ' + (sc === lab.questions ? 'finished' : 'part way') +
                     '.  ' + where);
        }
      }
    }
  }
  say('Could not read that code. Either it was invented, or it belongs to somebody who is not ' +
      'one of your students — anyone in the world may use the labs and nothing about them is ' +
      'recorded, so their code cannot be read here. One more possibility: a code is made from ' +
      'the name on the GOOGLE account that signed in. If a name was typed into the Students tab ' +
      'by hand and it is shorter or spelt differently from the Google one — “Daniel” against ' +
      '“Daniel Mompel Riera” — the code will not match until that student has handed in once, ' +
      'after which the Google name is remembered. Importing from Classroom avoids this: the ' +
      'names come from the same Google accounts.');
}

/* Whether that student's hand-in actually arrived, so a recovered code is not entered twice. */
function _rowSaysWhat(lab, name) {
  var sh = _ss().getSheetByName(lab.name);
  if (!sh || sh.getLastRow() < 2) return 'Nothing has been handed in for this lab yet.';
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, LAB_COLS.length).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim().toLowerCase() !== name.toLowerCase()) continue;
    return (rows[i][2] === '' || rows[i][2] === null)
      ? 'Their hand-in never arrived — this code is the only record of it.'
      : 'Already in the ' + lab.name + ' tab: ' + rows[i][2] + '/' + rows[i][3] + '.';
  }
  return 'They have no row in the ' + lab.name + ' tab.';
}

function _code(labId, name, form, score) {
  var raw = String(name).trim().toLowerCase() + '|' + form + '|' + score + '|' + labId;
  var s1 = 0, s2 = 0;
  for (var i = 0; i < raw.length; i++) {
    s1 = (s1 * 31 + raw.charCodeAt(i)) >>> 0;
    s2 = (s2 ^ (s1 + i)) >>> 0;
  }
  var A = 'ACDEFGHJKLMNPQRTUVWXY3479';
  function chunk(n) {
    var o = '';
    for (var i = 0; i < 4; i++) { o += A.charAt(n % A.length); n = Math.floor(n / A.length); }
    return o;
  }
  return 'DL-' + chunk(s1) + '-' + chunk(s2);
}
function _tidy(s) { return String(s || '').toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim(); }
function _text(m) { return ContentService.createTextOutput(m).setMimeType(ContentService.MimeType.TEXT); }
```

</details>

<details>
<summary><b>ClassroomImport.html</b> — the import dialog (also at <a href="apps-script/ClassroomImport.html">apps-script/ClassroomImport.html</a>)</summary>

```html
<!--
  Biology Labs — import students from Google Classroom
  Copyright (c) 2025-2026 Daniel Mompel Riera. All rights reserved.

  ONE long-running server call does the work, and the dialog polls a cached progress
  record alongside it. So each class ticks green as it
  finishes, and closing this window does not interrupt the import — Apps Script
  never learns that the client went away.
-->
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #c9d1d9; padding: 16px; font-size: 13px; }
h2 { font-size: 15px; color: #e6edf3; margin-bottom: 4px; }
.subtitle { color: #8b949e; font-size: 12px; margin-bottom: 14px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; color: #8b949e; text-transform: uppercase; letter-spacing: .04em; padding: 6px 8px; border-bottom: 1px solid #30363d; white-space: nowrap; }
td { padding: 5px 8px; border-bottom: 1px solid #21262d; vertical-align: middle; }
tr.row:hover { background: #161b22; }
tr.row.selected { background: #0d1926; }
.cb { width: 16px; height: 16px; accent-color: #58a6ff; cursor: pointer; }
input[type="text"] { background: #161b22; border: 1px solid #30363d; border-radius: 4px; color: #e6edf3; padding: 4px 8px; font-size: 12px; width: 72px; }
input[type="text"]:focus { border-color: #58a6ff; outline: none; }
input[type="text"].err { border-color: #f85149; }
.badge { font-size: 10px; padding: 1px 6px; border-radius: 3px; margin-left: 6px; }
.badge-have { background: #23863633; color: #3fb950; }
.badge-dup  { background: #f8514933; color: #f85149; }
.status { font-size: 12px; white-space: nowrap; min-width: 130px; }
.status .spin { display: inline-block; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn { padding: 8px 20px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; }
.btn-primary { background: #238636; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #2ea043; }
.btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.btn-close { background: #21262d; color: #c9d1d9; }
.btn-close:hover { background: #30363d; }
.bar { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
.bar .count { color: #8b949e; font-size: 12px; }
.loading { text-align: center; padding: 40px; color: #8b949e; }
.summary { margin-top: 12px; padding: 10px 14px; background: #161b22; border-radius: 6px; font-size: 12px; color: #8b949e; line-height: 1.6; }
.course-name { color: #e6edf3; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: bottom; }
.section { color: #8b949e; font-size: 11px; }
</style>
</head>
<body>
<h2>Import students from Google Classroom</h2>
<div class="subtitle" id="subtitle">Loading courses…</div>

<div id="content"><div class="loading">Fetching your Google Classroom courses…</div></div>

<div class="bar" id="bar" style="display:none">
  <span class="count" id="sel-count">0 selected</span>
  <div style="display:flex;gap:8px">
    <button class="btn btn-close" onclick="google.script.host.close()">Cancel</button>
    <button class="btn btn-primary" id="btn-import" disabled onclick="startImport()">Import selected</button>
  </div>
</div>

<script>
var DATA = null;
var importing = false;

google.script.run
  .withSuccessHandler(function (d) { DATA = d; render(); })
  .withFailureHandler(function (e) {
    document.getElementById('content').innerHTML =
      '<div class="loading" style="color:#f85149">Could not load your courses: ' + esc(e.message) + '</div>';
  })
  .getBatchImportData();

function esc(s) { var d = document.createElement('span'); d.textContent = s; return d.innerHTML; }

function render() {
  if (!DATA || !DATA.courses.length) {
    document.getElementById('content').innerHTML = '<div class="loading">No active courses found.</div>';
    return;
  }
  document.getElementById('subtitle').textContent =
    DATA.courses.length + ' active course(s). Tick the ones to import, check the class code, then Import. ' +
    'Students already here are skipped, so you can re-run this whenever someone joins.';
  document.getElementById('bar').style.display = '';

  var html = '<table><thead><tr>' +
    '<th style="width:28px"><input type="checkbox" class="cb" id="cb-all" onchange="toggleAll(this.checked)"></th>' +
    '<th style="width:28px">#</th>' +
    '<th>Course</th>' +
    '<th style="width:96px">Class code</th>' +
    '<th>Status</th>' +
    '</tr></thead><tbody>';

  DATA.courses.forEach(function (c, i) {
    html += '<tr class="row" id="row-' + i + '">' +
      '<td><input type="checkbox" class="cb" id="cb-' + i + '" onchange="updateUI()"></td>' +
      '<td style="color:#8b949e">' + (i + 1) + '</td>' +
      '<td><span class="course-name">' + esc(c.name) + '</span>' +
        (c.section ? ' <span class="section">' + esc(c.section) + '</span>' : '') +
        '<span id="badge-' + i + '"></span></td>' +
      '<td><input type="text" id="cc-' + i + '" value="' + esc(c.autoClassCode) + '" ' +
        'oninput="updateUI()" placeholder="e.g. 9A"' + (c.autoClassCode ? '' : ' class="err"') + '></td>' +
      '<td class="status" id="st-' + i + '">—</td>' +
    '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('content').innerHTML = html;
  updateUI();
}

function toggleAll(checked) {
  DATA.courses.forEach(function (_, i) { document.getElementById('cb-' + i).checked = checked; });
  updateUI();
}

function getSelections() {
  var sels = [];
  DATA.courses.forEach(function (c, i) {
    if (!document.getElementById('cb-' + i).checked) return;
    sels.push({
      idx: i,
      courseId: c.id,
      classCode: document.getElementById('cc-' + i).value.trim().toUpperCase(),
      courseName: c.display
    });
  });
  return sels;
}

function updateUI() {
  if (importing) return;
  var sels = getSelections();
  document.getElementById('sel-count').textContent = sels.length + ' selected';

  DATA.courses.forEach(function (_, i) {
    document.getElementById('badge-' + i).innerHTML = '';
    var cc = document.getElementById('cc-' + i);
    cc.classList.toggle('err', document.getElementById('cb-' + i).checked && !cc.value.trim());
  });

  var byCode = {}, hasEmpty = false;
  sels.forEach(function (s) {
    if (!s.classCode) { hasEmpty = true; return; }
    var have = DATA.have[s.classCode];
    if (have) document.getElementById('badge-' + s.idx).innerHTML =
      '<span class="badge badge-have" title="Already in the Students tab — they will be skipped">' + have + ' already</span>';
    (byCode[s.classCode] = byCode[s.classCode] || []).push(s.idx);
  });
  Object.keys(byCode).forEach(function (code) {
    if (byCode[code].length > 1) byCode[code].forEach(function (idx) {
      document.getElementById('badge-' + idx).innerHTML =
        '<span class="badge badge-dup" title="Two courses share this class code — their students will be merged into one class">merge</span>';
    });
  });

  document.getElementById('btn-import').disabled = sels.length === 0 || hasEmpty;
}

/* ── the import: one long call, progress polled alongside it ── */
var POLL_INTERVAL_MS = 1500;
var pollHandle = null;
var pollFinished = false;

function startImport() {
  var sels = getSelections();
  if (!sels.length) return;
  importing = true;
  pollFinished = false;
  var btn = document.getElementById('btn-import');
  btn.disabled = true;
  btn.textContent = 'Importing ' + sels.length + ' class(es)…';
  Array.prototype.forEach.call(document.querySelectorAll('.cb, input[type="text"]'), function (el) { el.disabled = true; });

  sels.forEach(function (s, i) {
    var st = document.getElementById('st-' + s.idx);
    if (st) st.innerHTML = '<span class="spin">⏳</span> Queued (' + (i + 1) + '/' + sels.length + ')';
    var row = document.getElementById('row-' + s.idx);
    if (row) row.classList.add('selected');
  });

  document.getElementById('bar').insertAdjacentHTML('afterbegin',
    '<div id="close-hint" style="font-size:11px;color:#8b949e;margin-bottom:6px">' +
    'You can close this window — the import keeps running. Re-open the sheet to see the result.</div>');

  var jobId = 'batch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

  google.script.run
    .withSuccessHandler(function (results) {
      stopPolling();
      applyResults(sels, results);
      if (!pollFinished) showFinalSummary(sels);
      pollFinished = true;
    })
    .withFailureHandler(function (err) {
      /* The call can fail after the server actually finished — a network blip on
         the way back. Ask the cache once more before calling anything failed. */
      stopPolling();
      google.script.run
        .withSuccessHandler(function (p) {
          if (p && Array.isArray(p.results)) applyResults(sels, p.results);
          finalizeAfterError(sels, err);
        })
        .withFailureHandler(function () { finalizeAfterError(sels, err); })
        .getBatchImportProgress(jobId);
    })
    .executeBatchImportAll(sels, jobId);

  startPolling(jobId, sels);
}

function startPolling(jobId, sels) {
  if (pollHandle) clearInterval(pollHandle);
  pollHandle = setInterval(function () {
    google.script.run
      .withSuccessHandler(function (p) {
        if (!p) return;
        applyResults(sels, p.results);
        if (p.done) {
          stopPolling();
          if (!pollFinished) showFinalSummary(sels);
          pollFinished = true;
        }
      })
      .withFailureHandler(function () { /* one poll failed; try the next */ })
      .getBatchImportProgress(jobId);
  }, POLL_INTERVAL_MS);
}
function stopPolling() { if (pollHandle) { clearInterval(pollHandle); pollHandle = null; } }

function applyResults(sels, results) {
  if (!Array.isArray(results)) return;
  results.forEach(function (r, i) {
    var s = sels[i];
    if (!s || !r || r.status === 'pending') return;
    var key = r.status + ':' + (r.added || 0) + ':' + (r.skipped || 0) + ':' + (r.error || '');
    if (s._renderedKey === key) return;
    s._renderedKey = key; s._result = r;
    var st = document.getElementById('st-' + s.idx);
    if (!st) return;
    if (r.status === 'success') {
      st.innerHTML = '<span style="color:#3fb950">✅ ' + r.added + ' added</span>' +
        (r.skipped ? ' <span style="color:#8b949e">(' + r.skipped + ' already here)</span>' : '') +
        (r.moved ? ' <span style="color:#d29922">(' + r.moved + ' moved class)</span>' : '');
    } else if (r.status === 'empty') {
      st.innerHTML = '<span style="color:#d29922">⚠ No students in that course</span>';
    } else {
      st.innerHTML = '<span style="color:#f85149">❌ ' + esc(r.error || 'Error').substring(0, 60) + '</span>';
    }
  });
}

function finalizeAfterError(sels, err) {
  if (pollFinished) return;
  sels.forEach(function (s) {
    if (s._result) return;
    s._result = { status: 'error', error: (err && err.message) || 'Server error' };
    var st = document.getElementById('st-' + s.idx);
    if (st) st.innerHTML = '<span style="color:#f85149">❌ ' + esc((err && err.message) || 'Error').substring(0, 60) + '</span>';
  });
  showFinalSummary(sels);
  pollFinished = true;
}

function showFinalSummary(sels) {
  importing = false;
  var ok = 0, fail = 0, added = 0, skipped = 0;
  sels.forEach(function (s) {
    var r = s._result || {};
    if (r.status === 'success') { ok++; added += (r.added || 0); skipped += (r.skipped || 0); }
    else if (r.status !== 'empty') fail++;
  });
  var hint = document.getElementById('close-hint'); if (hint) hint.remove();
  document.getElementById('bar').innerHTML =
    '<div class="summary">' +
      '<strong>' + ok + '</strong> class(es) imported. ' +
      '<strong>' + added + '</strong> student(s) added' +
      (skipped ? ', ' + skipped + ' already here' : '') + '.' +
      (fail ? ' <span style="color:#f85149">' + fail + ' failed.</span>' : '') +
    '</div>' +
    '<button class="btn btn-close" style="margin-top:10px" onclick="google.script.host.close()">Close</button>';
}
</script>
</body>
</html>
```

</details>

---

## 🛠️ For developers

<details>
<summary><b>Adding a lab, the layout, and running it locally</b></summary>

<br>

**Adding a lab.** Edit one file: [`js/topics.js`](js/topics.js). Give the topic a `url`, set
`status: 'live'` — both front doors pick it up.

```js
{ id:'circulation', no:9, year:'Y10', sys:'circulation', anchor:'o-heart',
  title:'Transport in animals', lab:'Circulation Lab',
  blurb:'Double circulation, the heart, blood vessels and what blood carries.',
  status:'live', url:'https://mompel226.github.io/circulation-lab/' },
```

For the lab to link back here, add one line to its header — see
[`docs/link-back.md`](docs/link-back.md).

**Layout.**

```
index.html                the front door — the 3D body
plate.html                the light version — the flat anatomical plate
js/topics.js              THE TOPIC REGISTER — the only file you edit to add a lab
js/body3d.js              the 3D scene: loading, lighting, picking, idle tour
js/hub.js                 the flat plate: hotspots, lighting, pinned labels, idle tour
css/hub.css               design tokens, both layouts, both colour sets
assets/model/body.glb     the MRI body — 40 organ groups, 345k triangles, 6.2 MB
assets/anatomy/           the flat plate and its organ paintings
apps-script/              the marks spreadsheet: the script and its import window
tools/gastest.js          runs the script against a stand-in for Google Sheets
tools/sync-readme.mjs     copies apps-script/ into this README's paste blocks
tools/model-build/        rebuild the 3D body from BodyParts3D
tools/inline-plate.py     re-inline the flat plate into plate.html
docs/BUILD-NOTES.md       the long-form notes
```

**Running it locally.** `plate.html` opens by double-clicking; `index.html` does not —
browsers block module scripts and model loading from `file://` — so serve the folder:

```bash
python3 -m http.server 8744
```

**After changing anything in `apps-script/`,** run both:

```bash
node tools/gastest.js apps-script/Code.gs && node tools/sync-readme.mjs
```

The first runs the whole script against a stand-in for Google Sheets — every menu item and
button, an import, a first hand-in and a second, a forged one, a stranger's — and fails on
anything undefined. The second copies the files into the paste blocks above, which is how
teachers install it.

**The anatomy is measured, not drawn.** The body is **BodyParts3D**, organs segmented from a
real full-body MRI, chosen by FMA identifier — nothing is placed by hand. What was checked,
and what the dataset lacks, is in [`docs/BUILD-NOTES.md`](docs/BUILD-NOTES.md).

</details>

---

## 📖 Sources and licences

| What | Source | Licence |
|------|--------|---------|
| The 3D body | [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html), © The Database Center for Life Science | **CC BY-SA 2.1 Japan** |
| The flat plate | [M. Häggström, *Human body diagrams*](https://commons.wikimedia.org/wiki/Human_body_diagrams) | CC0 (public domain) |
| Uterus and ovaries | [Servier Medical Art](https://smart.servier.com) | CC BY 4.0 |
| 3D rendering | [three.js](https://threejs.org) | MIT |

> [!NOTE]
> **ShareAlike applies to the body model.** `assets/model/body.glb` is a derivative of
> BodyParts3D, so publishing it licenses that file onward under CC BY-SA 2.1 Japan. The credit
> line in the page footer is part of that obligation — please keep it when you fork.

---

<div align="center">

### Who made this

**Dr Daniel Mompel Riera** — Biology, North London Collegiate School Jeju.

Built for his Year 10 and 11 IGCSE Biology classes.
Questions, corrections, or if you would like to use it with your own students:

[![Email](https://img.shields.io/badge/dmompelriera@nlcsjeju.kr-3D7A54?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dmompelriera@nlcsjeju.kr)

<sub>© Dr Daniel Mompel Riera. The anatomical source material is licensed as set out above;
the site itself — its design, its writing and its questions — is his work.</sub>

</div>
