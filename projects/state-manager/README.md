# State Manager

## Installation

* From npm: `npm install @alkemist/ngx-state-manager`
* From yarn: `yarn add @alkemist/ngx-state-manager`

## Test

* From npm: `npm run test --workspace @alkemist/ngx-state-manager`
* From yarn: `yarn workspace @alkemist/ngx-state-manager test`

## About

Inspiré de [@ngxs/store](https://github.com/ngxs/store), ce gestionnaire d'état se veut plus sobre,
et se base sur les signaux à la place des observables.
Il se base aussi sur mon [Compare Engine](https://github.com/alkemist/compare-engine) pour différencier l'état
avant/après une action, et pour parcourir le state

## Example

### Configuration

De façon similaire à NGXS, il y a 4 décorateurs :

- @StateDefinition
  - Il permet de décorer la classe qui définit le state et se base sur une configuration
    - defaults (obligatoire) : les valeurs par défaut
    - determineArrayIndexFn (optionnel ou obligatoire) : utilisé à la fois dans
      le [Compare Engine](https://github.com/alkemist/compare-engine) mais aussi dans le store pour gérer les tableaux
      d'objet.
      C'est une fonction qui prend en paramètre un path et retourne le nom de la propriété déterminante, celle qui
      servira comme clé pour comparer 2 éléments d'un tableau.
      Ce paramètre est obligatoire pour une utilisation d'un state en mode CRUD.
    - showLog (optionnel) : Affiche les logs (A l'initialisation des stores, et à chaque action)
    - enableLocalStorage (optionnel) : Permet se stocker/restaurer les données d'un state dans le Local Storage
  - La classe doit étendre de StateExtend et définir une propriété stateKey qui servira d'identifiant unique du state
    dans le store.
- @StateSelect / @StateObserve
  - Il permet de lier une partie du store (défini par le @StateSelect) à un Signal (décoré avec le @StateObserve)
  - @StateSelect prend en paramètre facultatif un path sur lequel le Compare Engine se base pour détecter une
    modification et mettre à jour le @StateObserver que s'il a été modifié.
    Il doit décorer une méthode statique.
  - @StateObserve prend en paramètre la classe du State, et la méthode statique du @StateSelect
    Il doit décorer une propriété de classe de type WritableSignal
- @StateAction
  - Il permet de faire des actions sur le state, le 1er paramètre est le StateContext, le 2e le payload qui sera
    récupérer par le dispatch.
  - Il prend comme paramètre une classe qui a :
    - Une propriété static "log" (utilisé pour les logs d'action)
    - Un constructeur qui a comme paramètre le payload utilisé par l'action
  - Il doit décorer une méthode de classe.

### Classic

    export interface ExampleStateInterface extends ValueRecord {
      aStringValue: string;
    }

    class StringValueAction {
      static readonly log = "An string value action";
  
      constructor(public payload: string) {}
    }

    @StateDefinition({
      defaults: <ExampleStateInterface>{
        aStringValue: '',
      },
      showLog: true,
      enableLocalStorage: true
    })
    export class ExampleState extends StateExtend {
      stateKey = 'Example';
    
      @StateSelect('aStringValue')
      static aStringValueSelector(state: ExampleStateInterface): string {
        return state.aStringValue;
      }
      
      @StateAction(StringValueAction)
      aStringValueAction(context: StateContext<ExampleStateInterface>, payload: string) {
        context.patchState({
          aStringValue: payload
        })
      }
    }

    @Component({
      standalone: true,
      template: ''
    })
    export class ExampleComponent {
      @StateObserve(ExampleState, StringValueSelector)
      aStringValueObserver!: WritableSignal<string>;

      constructor(private stateManager: StateManagerService) {}

      getStringValue() {
        return this.stateManager.select(ExampleState, StringValueSelector);
      }

      dispatchStringValue(value: string) {
          this.stateManager.dispatch(
            ExampleState,
            new Example.aStringValueAction(value)
          )
      }
    }

### Crud

Dans le cas d'un state lié à table, le @StateCrudDefinition permet d'offrir des selecteurs et des actions de bases.

    interface StateCrudData<ITEM> extends ValueRecord {
      all: ITEM[]
      lastUpdated: Date | null;
    }

    interface UserInterface {
      id: number,
      name: string,
    }

    interface UserStateInterface extends StateCrudData<UserInterface> {
      current: UserInterface | null
    }

    @StateCrudDefinition({
      defaults: {
        all: [],
        lastUpdated: null,
        current: null
      },
      determineArrayIndexFn: _ => 'id',
      showLog: true,
      enableLocalStorage: true
    })
    export class UserState extends StateCrudExtend<UserState, UserStateInterface, UserInterface> {
      override stateKey = 'Users';
    }

## Exposed services, models, enums and utils

### Service

    class StateManagerService {
      ### Utilisation classique

      select<STATE, DATA, ITEM>(
        stateClass: StateExtendClass<STATE>,
        selectFunction: StateSelectFunction<DATA, ITEM>
      )
      
      dispatch<STATE>(
        stateClass: StateExtendClass<STATE>, 
        actions: any | any[]
      )
      
      ### Utilisation CRUD

      selectAll<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>
      )
      
      selectLastUpdateDate<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>
      )
      
      dispatchFill<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>,
        payload: ITEM[]
      )
      
      dispatchAdd<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>,
        payload: ITEM
      )
      
      dispatchReplace<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>,
        payload: ITEM
      )
      
      dispatchUpdate<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>,
        payload: Partial<ITEM>
      )
      
      dispatchRemove<STATE, ITEM>(
        stateClass: StateExtendClass<STATE>,
        payload: ITEM
      )
      
      dispatchReset<STATE>(
        stateClass: StateExtendClass<STATE>,
      )
    }

### State Context

    class StateContext<DATA extends ValueRecord, ITEM = any> {
      
      getState(): DATA
      
      setState(val: DATA)
      
      setInState(paths: ValueKey[] | ValueKey, val: any)
      
      patchState(val: Partial<DATA>)
      
      patchInState(paths: ValueKey[] | ValueKey, val: any)
      
      addItem(paths: ValueKey[] | ValueKey, item: ITEM) 
      
      addItems(paths: ValueKey[] | ValueKey, items: ITEM[])
      
      # Utilisation classique, sans determineArrayIndexFn

      remplaceOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean, item: ITEM)

      patchOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean, item: Partial<ITEM>)
      
      removeOneItem(paths: ValueKey[] | ValueKey, selector: (item: ITEM) => boolean)

      # Utilisation simplifié, avec determineArrayIndexFn

      replaceItem(paths: ValueKey | ValueKey[], itemToReplace: ITEM)

      patchItem(paths: ValueKey | ValueKey[], itemToPatch: Partial<ITEM>)

      removeItem(paths: ValueKey | ValueKey[], itemToRemove: ITEM)
    }

## License

[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)
