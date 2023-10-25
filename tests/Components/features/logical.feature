Feature: Components-->form elements-->selection
Feature Description:Check the list of dropdown functionalities
    @demo
    # Scenario: Select the single option
    # Given User ensures the select dropdown is available in the selection tab
    # When User selects the desired option by clicking the select dropdown
    # Then The selected option must be displayed under the select dropdown

    @demo
    # Scenario: Deselect the chosen option 
    # Given User ensures any of the option is selected from the select dropdown
    # When User deselects the existing option by selecting the new option in select dropdown
    # Then The newly replaced option must be displayed under the select dropdown

    @demo
    # Scenario: Select the single option by searching keyword
    # Given User ensures the select with search dropdown is available in the selection tab
    # When User selects the option by searching keyword in the search box
    # Then The selected option must be displayed under the select with search dropdown

    @demo
    # Scenario:Deselect the chosen option by searching keyword

    # Given User ensures any of the option is selected from the select with search dropdown
    # When User deselects the existing option by selecting the new option in select with search dropdown
    # Then The newly replaced option must be displayed under the select with search dropdown

    @demo
    # Scenario:Select the single option by search keyword/decoration
    # Given User ensures the select with search and decoration dropdown is available in the selection tab
    # When User selects the option by searching decoration in the search box 
    # Then The selected decoration option must be displayed under the select with search and decoration dropdown

    @demo
    # Scenario:deselect the option by clicking (close)'X' option
    # Given The selected option must be displayed under the 'select with search and decoration dropdown
    # When User clicks on the X button to deselect the existing option
    # Then User ensures the Select with search and decoration dropdown must be empty 

    @demo
    # Scenario:search the unavailable option 
    # Given User ensures the select with search and decoration dropdown is available
    # When Use searches the unavailable keyword in the search box 
    # Then No matched items message must be displayed.

    @demo
    # Scenario:Select the desired list of checkbox
    # Given User ensures the List box select option is available in the selection tab
    # When User selects the multiple desired options from the checkbox available
    # Then User ensures the selected checkbox options must be displayed

    @demo
    # Scenario:deselect the desired checkboxes
    # Given User ensures the List box select option is available
    # When User deselects the multiple desired options from the checkbox
    # Then User ensures the deselected checkbox options must be displayed

    @demo
    # Scenario:Select the business values
    # Given User ensures the Business code dropdown option is available in the selection tab
    # When User selects the desired business value by searching the keyword in the search box available
    # Then User ensures the selected business value is displayed under business code dropdown

    @demo
    # Scenario:Change the business value
    # Given User ensures the selected business value is available under business code dropdown
    # When User change the desired business value by searching the keyword in the search box available
    # Then User ensures the changed option should be displayed under business code dropdown

    @demo
    # Scenario:Check the unavailable value
    # Given User ensures the Business code dropdown option is available
    # When Use searches the unavailable keyword in the Business code dropdown search box 
    # Then No matched items should be displayed under the Business code dropdown


    @demo
    # Scenario:Select the dependent value
    # Given User ensures the dependent dropdown option is available in the selection tab
    # When User selects the desired dependent value from the dropdown  
    # Then User ensures the selected dependent value is displayed under dependent dropdown

    @demo
    # Scenario:Change the dependent value
    # Given User ensures the selected dependent value is available under dependent dropdown of selection tab
    # When User change the desired dependent value under the dependent dropdown
    # Then User ensures the changed option should be displayed under dependent dropdown

    @demo
    # Scenario:Select the URL
    # Given User ensures the URL dropdown option is available in the selection tab
    # When User selects the desired URL option by searching the keyword in the search box available
    # Then User ensures the selected URL is displayed under URL dropdown

    @demo
    # Scenario:Change the URL
    # Given User ensures the selected URL value is available under URL dropodown
    # When User change the desired URL value by searching the keyword in the search box available
    # Then User ensures the changed option should be displayed under URL dropdown

    @demo
    # Scenario:Check the unavailable value
    # Given User ensures the URL dropdown is available in selection tab
    # When Use searches the unavailable keyword in the URL dropdown search box
    # Then No matched items should be displayed under the URL dropdown

    @demo
    # Scenario:Select the auto populate value
    # Given User ensures the Auto populate dropdown is available in the selection tab
    # When User selects the desired auto populate option from the dropdown
    # Then User ensures the selected auto populate value is displayed under auto populate dropdown

    @demo
    # Scenario:Change the auto populate value
    # Given User ensures the selected auto populate value is available under auto populate dropdown 
    # When User change the desired auto populate value under the auto populate dropdown
    # Then User ensures the changed option should be displayed under auto populate dropdown

    @demo
    # Scenario:Select the values from model dropdown
    # Given User ensures the Model dropdown option is available in the selection tab
    # When User selects the desired model option by searching the keyword in the search box available
    # Then User ensures the selected model is displayed under Model dropdown

    @demo
    # Scenario:Change the selected value
    # Given User ensures the selected model value is available under Model dropdown
    # When User change the desired model value by searching the keyword in the search box available
    # Then User ensures the changed option should be displayed under Model dropdown

    @demo
    # Scenario:Move the options under Advanced select
    # Given User ensures the Advance select option is available in the selection tab
    # When User selects the desired available options and then click move option
    # Then User ensures the chosen option should be moved

    @demo
    # Scenario:Move back the options under Advanced select
    # Given User ensures the selected options can be moved back to other folder
    # When User select desired options and then click move back option
    # Then User ensures the chosen option should be moved back

    @demo
    # Scenario:Change the priority of options
    # Given User ensures the list of selected options are available 
    # When User selects the options and then click priority option
    # Then User ensures the desired options should be rearranged