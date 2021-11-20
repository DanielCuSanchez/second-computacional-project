require('colors')
const fs = require('fs')
const path = require('path')

/**
    * @function
    * @desc This is the init app function
    * @version 1.0.0
*/
exports.app = async (nameFile) => {
  //With this works the app
  const file = openFile(nameFile)
  const automata = getInitialAutomata(file)
  console.log('AUTOMATA'.rainbow, automata)
  //Extendended DFA Here
  let queue = [...getQueue(automata)]
  await getDFA([...queue])


  /**
   * Since here starts the methods
  */

  /**
  * @method getDFA
  * @desc This function generates the dfa automata
  * @version 1.0.0
  * @param {automataNDFA} file file already opened
  * @returns {automataDFA} automata DFA
  */
  async function getDFA(queue) {

    console.log('INITIAL_QUEUE'.blue, queue)
    //Temp variables to check the states
    const statesAnalized = []
    const newStatesToAnalize = []
    // AutomataDFA
    const automataDFA = {}

    while (queue.length > 0) {
      const next = queue.pop()
      statesAnalized.push(next)

      for (const element of next) {
        const statesA = getTransitionFunction(element, "a")
        console.log('NUEVO_A'.yellow, statesA, 'ELEMENTO', element)

        const statesB = getTransitionFunction(element, "b")
        console.log('NUEVO_B'.yellow, statesB, 'ELEMENTO', element)

        if (!automataDFA[next]) {
          automataDFA[next] = {
            "a": [...statesA || []],
            "b": [...statesB || []]
          }
        } else if (automataDFA[next]['a'] && automataDFA[next]['b']) {
          automataDFA[next] = {
            "a": [...new Set([...automataDFA[next]['a'], ...statesB || []])],
            "b": [...new Set([...automataDFA[next]['b'], ...statesB || []])]
          }
        }
        const unionStates = union(statesA, statesB)
        console.log('UNION_A_B'.red, unionStates, 'ELEMENTO', `${element}`.red)
        newStatesToAnalize.push(unionStates)
      }
    }

    let filterToAnalize = filterArray(newStatesToAnalize)
    const exist = existsNewStates(statesAnalized, filterToAnalize)
    console.log('Dictionary'.blue, automataDFA)
    if (exist) {
      getDFA([...filterToAnalize])
    }
    else {
      return
    }
  }

  function existsNewStates(statesAnalized = [], newStatesToAnalize = []) {
    let decision = false
    for (const newState of newStatesToAnalize) {
      if (!(statesAnalized.some(sA => {
        return sA.toString() === newState.toString()
      }))) {
        decision = true
      }
    }
    return decision
  }

  function filterArray(arr) {
    const temp = arr.map(e => e.toString())
    const temp2 = temp.filter((e, index) => {
      return temp.indexOf(e) === index
    })
    const statesFiltered = temp2.map(e => e.split(","))
    return statesFiltered
  }


  function getQueue(automataNDFA) {
    const initalState = automataNDFA.initialState[0]
    const statesA = getTransitionFunction(initalState, 'a')
    const statesB = getTransitionFunction(initalState, 'b')
    const queue = []
    queue.push([initalState])
    queue.push(statesA)
    queue.push(statesB)
    return queue
  }
  /**
     * @method union
     * @desc This function is the unión of the states
     * @version 1.0.0
     * @param {Array} acumTransitions  the unión of the transitions states
     * @param {Array} transition result of transition function
     *@returns {Array} acumTransitions  the unión of the transitions states
     *@returns {Array} transition result of transition function
   */
  function union(statesA = [], statesB = []) {

    const temp = [...statesA || [], ...statesB || []]

    const union = temp.filter((c, index) => {
      return temp.indexOf(c) === index;
    });

    return union
  }

  /**
  * @method getInitialAutomata
  * @desc This function generates the initial automata
  * @version 1.0.0
  * @param {object} file a txt file already opened
  * @returns {object} initial automata
  */
  function getInitialAutomata(file) {
    const states = accessToFile(file, 0)
    const alphabet = accessToFile(file, 1)
    const initialState = accessToFile(file, 2)
    const finalStates = accessToFile(file, 3)
    const transitions = cutFile([...file], 4)
    return {
      states,
      alphabet,
      initialState,
      finalStates,
      transitions
    }
  }


  /**
    * @method getTransitionTable
    * @desc This function generates the transition table
    * @version 1.0.0
    *@returns {object} transition table
  */
  function getTransitionTable() {
    const { states, transitions } = automata
    const table = transitions.map(transition => formatTransition(transition))
    table.forEach(transition => {
      transition.splice(1, 0, [...transition[1].split('=>')][0])
      transition[2] = [...transition[2].split('=>')][1]
    })
    const transitionTable = {}
    states.map(state => {
      transitionTable[state] = {}
    })
    Object.keys(transitionTable).map(key => {
      table.map((element, index) => {
        if (key === element[0]) {
          transitionTable[key][element[1]] = {}
          if (transitionTable[key][element[1]]) {
            transitionTable[key][element[1]] = table[index].slice(2, table[index].length)
          }
        }
      })
    })
    return transitionTable
  }


  /**
    * @method getTransitionFunction
    * @desc This function returns the states from each character that we wan to validate
    * @version 1.0.0
    * @param {string} state current state to find in transition table
    * @param {string} string current string to find in transition table
    *@returns {Array} current transition
  */
  function getTransitionFunction(state, char) {
    const transitionTable = getTransitionTable(automata)
    if (!transitionTable[state]) {
      return null
    } else if (!transitionTable[state][char]) {
      return null
    } else {
      return transitionTable[state][char]
    }
  }




  /** FILE METHODS */

  /**
   * @method openFile
   * @desc This function generates initial automota from the file
   * @version 1.0.0
   * @param {text} file file already opened
  */
  function openFile(file) {
    const fileOpened = fs.readFileSync(path.join(__dirname, `/files/${file}`), { encoding: 'utf-8' })
    const fileFormated = fileOpened.split('\r').map(line => line.replace('\n', ''))
    return fileFormated
  }


  /**
  * @method saveFile
  * @desc This function generates initial automota from the file
  * @version 1.0.0
  * @param {text} file file already opened
  */
  function saveFile(data) {
    console.log(data)
    try {
      fs.writeFileSync("dfa.txt", data, { encoding: 'utf-8' })
    } catch (error) {
      console.log(error)
    }
  }


  /**
    * @method accessToFile
    * @desc This function separate lines
    * @version 1.0.0
    * @param {Object} File  File to read
    * @param {Integer} line line of the file
  */
  function accessToFile(file, line) {
    return file[line].split(',')
  }


  /**
    * @method cutFile
    * @desc  This function gets the automata from the file
    * @version 1.0.0
    * @param {Object} File  File to read
    * @param {Integer} start start of the file
  */
  function cutFile(file, start) {
    return file.splice(start, file.length)
  }



  /**
   * @method formatTransition
   * @desc This function formats the transitions automata
   * @version 1.0.0
   * @param {Array} transition result of transition formatted
   *@returns {Array} transitionFormates  the transition with format
  */
  function formatTransition(transition) {
    const transitionFormated = transition.split(',')
    return transitionFormated
  }
}

/**
  * @method complete
  * @desc This function is used to acomplete line terminal
  * @version 1.0.0
  * @param {Array} commands default values to enter in terminal
  *@returns {Array} ret chosen values
*/
exports.complete = (commands) => {
  return function (str) {
    let i
    const ret = []
    for (i = 0; i < commands.length; i++) {
      if (commands[i].indexOf(str) === 0) { ret.push(commands[i]) }
    }
    return ret
  }
}
