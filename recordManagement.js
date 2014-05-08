///{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ GLOBALS }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

  var subjectArray = ["", "Bahasa Malayu", "Biology", "Business", "Chemistry","Digital Literacy", "Drama and Theatre Arts",
                      "EAL", "Economics", "English", "ESS", "Film and Media", "French", "Geography", "Global Perspectives",
                      "Health and PE", "History", "Humanities", "Mandarin", "Mathematics", "Music", "Physics", "PSHE", "Psychology",
                      "Science", "Spanish", "Sports Science", "Visual Art"];
  
  var yearArray = ["", "Reception", "Nursery", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9",
                   "Year 10", "Year 11", "Year 12", "Year 13"];

  var termArray = ["", "1.1", "1.2", "2.1", "2.2", "3.1", "3.2"];
  
  var conceptualArray = ["", "Balance", "Beliefs", "Change", "Civilisation", "Colour", "Complexity", "Continuity", "Conventions", "Creativity",
                         "Culture", "Cycle", "Design", "Emotions", "Energy", "Envy", "Evolution", "Fluency", "Force", "Form", "Freedom", "Function",
                         "Harmony", "Identity", "Influence", "Innovation", "Interaction", "Interdependence", "Metaphor", "Migration", "Oppression",
                         "Order", "Organisation", "Organism", "Origins", "Paradox", "Pattern", "Perspective", "Population", "Power", "Prejudice",
                         "Probability", "Proportion", "Relationships", "Revolution", "Rhythm", "Shape", "Space", "Structure", "Symbolism", "Symmetry",
                         "System", "Value"];
                         
  var patsKeyArray = ["informationAndMediaLiteracy", "takeInitiative", "knowledgeable", "criticalAnalysisAndEvaluation", "digitalApplicationsInMakingMovingImage",
                      "enquire", "principled", "metacognition", "researchSkills", "planNarrativesMovingImageProduction", "openMindedInternationallyMinded", "problemSolving",
                      "collaborate", "caring", "synthesiseDesignCreateMake", "courageous", "communicate", "balanced", "reflectReview", "resilientResourceful"];
                      
 //{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ DISPLAY }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function doGet() {
  Logger.log("running display function");
  var app = UiApp.createApplication();  
  
//COLORS
  var plain = "#FFFFFF";
  var light = "#F4F4F4";
  var mid = "#E0E0E0";
  var dark = "#606060";
  var titleColor = "#00b6de";
  var saveBar = "#61c1f1";
  var saveButton = "#c1d82f";

//STYLES
  var headerStyle = {color: dark, fontSize: "20px", width: "100%", height: "50px", lineHeight: "50px"};
  var smallBtnStyle = {width: "40px", height: "20px", fontSize: "10px", background: saveButton, color: dark};
  var largeBtnStyle = {width: "100px", height: "40px", fontSize: "14px", background: saveButton, color: dark};
  
//HANDLERS
  var createHandler = app.createServerHandler("form");
  var searchHandler = app.createServerHandler("searchDisplay")
  var editHandler = app.createServerHandler("editRecord");
  var openHandler = app.createServerHandler("openDocument");  
  
  var hPanel = app.createHorizontalPanel();
  var panel = app.createFlowPanel().setSize("900px", "6000px").setStyleAttributes({background: light, border: "1px solid #E0E0E0"}).setId("panel");
  
  var user = Session.getActiveUser().getEmail();
  var anyRecords = false;
  var isPublisher = false;
  var pubDept = "";
  
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  var pubSheet = ss.getSheetByName("Data");
  var pubRange = pubSheet.getRange("Publishers")
  var pubObjects = getRowsData(pubSheet, pubRange);
  
//DETERMINE IF USER IS PUBLISHER
  for(var i = 0; i < pubObjects.length; i++){  
    if(pubObjects[i].publisher == user){    
      isPublisher = true;
      pubDept = pubObjects[i].department;
      break;
    }  
  }

//SEARCH LIBRARY FOR DOCUMENTS AUTHORED BY USER OR AUTHORED BY DEPARTMENT IF USER IS PUBLISHER
  var recordRange = libSheet.getLastRow()-1;
  
  if(recordRange != 0){
    anyRecords = true;
    var libRange = libSheet.getRange(2, 1, recordRange, 38);  
    var recordObjects = getRowsData(libSheet, libRange);    
  }

//BUILD
  var createLabel = app.createLabel("Create a new scope document.");
  var searchLabel = app.createLabel("Search existing scope documents.");
  var createBtn = app.createButton("<B>create</B>").setStyleAttributes(largeBtnStyle).addClickHandler(createHandler);
  var searchBtn = app.createButton("<B>search</B>").setStyleAttributes(largeBtnStyle).addClickHandler(searchHandler);
                  

  
  var welcomeLabel = app.createLabel("Welcome " + user).setStyleAttribute("fontSize", "20px").setStyleAttributes(headerStyle);
  var welcomeTitle = app.createGrid(1,1).setWidth("900px")
                        .setCellPadding(10)
                        .setStyleAttributes({background: titleColor, width: "900px"})
                        .setWidget(0, 0, welcomeLabel);
  
  var topGrid = app.createGrid(2, 3)
                   .setStyleAttributes({width: "900px", marginTop: "30px"})
                   .setCellSpacing(0)
                   .setCellPadding(10)
                   .setWidget(0, 0, createLabel)
                   .setWidget(1, 0, searchLabel)
                   .setWidget(0, 1, createBtn)
                   .setWidget(1, 1, searchBtn);
 
 topGrid.setColumnStyleAttribute(0, "width", "300px");
 
 var existingLabel = app.createLabel("Your editable documents").setStyleAttribute("fontSize", "20px").setStyleAttributes(headerStyle);
 var docTitleGrid = app.createGrid(1,1)
                       .setWidth("900px")
                       .setCellPadding(10)
                       .setStyleAttributes({background: titleColor, marginTop: "30px", width: "900px"})
                       .setWidget(0, 0, existingLabel);
 
 var flex = app.createFlexTable().setStyleAttributes({marginTop: "10px", marginLeft: "10px", width: "880px", borderCollapse: "collapse", border: "1px solid #606060"})
               .setCellPadding(5)
               .setBorderWidth(1)
               .setWidget(0, 0, app.createLabel("Document ID"))
               .setWidget(0, 1, app.createLabel("Title"))
               .setWidget(0, 2, app.createLabel("Subject"))
               .setWidget(0, 3, app.createLabel("Date created")).setStyleAttribute(0, 3, "text-align", "center")
               .setWidget(0, 4, app.createLabel("Status")).setStyleAttribute(0, 4, "text-align", "center")
               .setWidget(0, 5, app.createLabel(""))
               .setWidget(0, 6, app.createLabel(""))
               .setRowStyleAttribute(0, "height", "40px");;
  
  var userRecords = [];
  
  Logger.log(pubDept);
  Logger.log(isPublisher);
  Logger.log(userRecords);


  if(anyRecords == true){
    if(isPublisher == true){
      for(var i = 0; i < recordObjects.length; i++){
        if(recordObjects[i].department == pubDept || recordObjects[i].author == user){
          userRecords.push(recordObjects[i]);
        }
      }
    }else{
      for(var i = 0; i < recordObjects.length; i++){    
        if(recordObjects[i].author == user){      
          userRecords.push(recordObjects[i]);
        }
      }
    }
  }
  
  var editText = "";
  var openText = "";
  
  if(isPublisher == true){
    editText = "pubEdit_";
    openText = "pubOpen_";  
  }else{
    editText = "autEdit_";
    openText = "autOpen_";  
  }
  
  //Logger.log(userRecords[0].docurl);
  
  for(var i = 0; i < userRecords.length; i++){
    
    flex.setText(i+1, 0, userRecords[i].documentId)
        .setText(i+1, 1, userRecords[i].title)
        .setText(i+1, 2, userRecords[i].subject)
        .setText(i+1, 3, shortDate(userRecords[i].dateCreated)).setStyleAttribute(i+1, 3, "text-align", "center")
        .setText(i+1, 4, userRecords[i].status.toString()).setStyleAttribute(i+1, 4, "text-align", "center")
        .setWidget(i+1, 5, app.createButton("edit").setId(editText + userRecords[i].documentId).addClickHandler(editHandler).setStyleAttributes(smallBtnStyle))
        .setRowStyleAttribute(i+1, "height", "40px");        
        
        if(userRecords[i].status.toString() == "Published"){
          var openPanel = app.createVerticalPanel();
          var openBtn = app.createButton("open").setStyleAttributes(smallBtnStyle)
          var docLink = app.createAnchor("open", userRecords[i].docurl).setStyleAttributes({'zIndex':'10', 'position':'absolute', 'marginLeft':'10px', 'marginTop':'-22px', 'color':'transparent'});
          openPanel.add(openBtn).add(docLink);
          flex.setWidget(i+1, 6, openPanel);        
          //flex.setWidget(i+1, 6, app.createButton("open").setId(userRecords[i].documentId).addClickHandler(openHandler).setStyleAttributes(smallBtnStyle))
          }else{
          flex.setText(i+1, 6, "");
        }
  }
  
  flex.setColumnStyleAttribute(0, "width", "60px")
      .setColumnStyleAttribute(1, "width", "400px")
      .setColumnStyleAttribute(2, "width", "200px")
      .setColumnStyleAttribute(3, "width", "120px")
      .setColumnStyleAttribute(4, "width", "80px")
      .setColumnStyleAttribute(5, "width", "45px")
      .setColumnStyleAttribute(6, "width", "45px")
      .setRowStyleAttribute(0, "background", mid)
      .setStyleAttributes({background: plain});
  
  panel.add(welcomeTitle)
  panel.add(topGrid);
  panel.add(docTitleGrid);
  panel.add(flex);
  app.add(panel);
  
  return app;
  
}
///{{{{{{{{{{{{{{{{{{{{{{{{{ FORM }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function form() {
  Logger.log("running form function");
  var app = UiApp.getActiveApplication();
  var displayPanel = app.getElementById("panel");
  app.remove(displayPanel);
  var flow = app.createFlowPanel().setSize("900px", "6000px");  
  var docId = "";  
  var docIdLabel = app.createLabel(docId).setId("docId").setTag(docId).setStyleAttribute("fontSize", "20px").setTitle("Automatically populated");  
  var author = Session.getActiveUser().getEmail();  
  var authorLabel = app.createLabel(author).setId("authorText").setTag(author).setStyleAttribute("fontSize", "20px").setTitle("Automatically populated");  
  var titleText = app.createTextBox().setWidth("700px").setHeight("30px").setName("titleText").setStyleAttribute("fontSize", "20px")
                     .setTitle("A brief title describing this scope.");
  
  var yearText = app.createListBox().setWidth("300px").setHeight("30px").setName("yearText");
  for(var n = 0; n < yearArray.length; n++){yearText.addItem(yearArray[n])};                 
  
  var termText = app.createListBox().setWidth("300px").setHeight("30px").setName("termText")
  for(var n = 0; n < termArray.length; n++){termText.addItem(termArray[n])}; 
  
  var lengthText = app.createTextBox().setWidth("294px").setHeight("30px").setName("lengthText").setTitle("The length of this piece of work, in weeks.");
  
  var subjectList = app.createListBox().setWidth("300px").setHeight("30px").setName("subjectText")
  for(var n = 0; n < subjectArray.length; n++){subjectList.addItem(subjectArray[n])}; 
  
  var datePick = app.createDateBox().setWidth("300px").setHeight("30px").setName("dateText");
  
  var unitText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("unitText")
                    .setTitle("A brief paragraph describing what the unit is concerned with for parents, \
learners and colleagues.");
  
  var conceptText = app.createListBox().setWidth("300px").setHeight("30px").setName("conceptText").setTitle("The conceptual lens helps the learners develop \
the cognitive process of seeing patterns and connections to link different elements.");
  for(var n = 0; n < conceptualArray.length; n++){conceptText.addItem(conceptualArray[n])}; 
  
  var relevantText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("relevantText")
                        .setTitle("Why do they need to learn this? How does it help learners understand the world better?");
                        
  var curricText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("curricText")
                      .setTitle("A goal is an end of key stage or end of year statement of attainment that all learners are expected to achieve.");
                      
  var keyText = app.createTextArea().setWidth("700px").setVisibleLines(1).setStyleAttribute("maxWidth", "700px").setName("keyText")
                   .setTitle("A concept is a big idea represented by one or two words. It is timeless, universal and abstract \
e.g. patterns.");

  var underText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("underText")
                     .setTitle("Understandings (essential ideas or generalisations) are transferable - learners can apply their understanding \
to different situations.");
  
  var debatableText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("debatableText")
                         .setTitle("Intended to provoke debate and look at a problem from multiple perspectives.");
                         
  var conceptualText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("conceptualText")
                          .setTitle("Questions that apply to other examples, other subjects or other situations. Normally 'why' questions.");
                          
  var factualText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("factualText")
                       .setTitle("Questions that have a right or wrong answer and needs to be known. Normally 'what' or 'how' questions.");  
  
  var knowText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("knowText")
                    .setTitle("Information is made up of discrete facts which need to be remembered and can be tested. Knowledge is \
not necessarily transferable unlike understanding which is.");

  var skillText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("skillText")
                     .setTitle("Knowledge of how to do something which can only be shown through demonstration.");
  
  var successText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("successText")
                       .setTitle("How will learners know and reflect on what they have learnt? \
Success criteria should be observable and measurable.");
  
  var assessText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("assessText")
                      .setTitle("What task or activity will give learners opportunity to demonstrate their understanding \
of the content, skills, essential ideas and key concepts that the unit has covered?");
  
//SAVE BUTTONS
  var saveBtnOne = app.createButton("<B>save</B>").setId("saveBtnOne");
  var saveBtnTwo = app.createButton("<B>save</B>").setId("saveBtnTwo");
  var saveBtnThree = app.createButton("<B>save</B>").setId("saveBtnThree");
  var saveBtnFour = app.createButton("<B>save</B>").setId("saveBtnFour");
  var saveBtnFive = app.createButton("<B>save</B>").setId("saveBtnFive");

//SAVE LABELS
  var saveLabel1 = app.createLabel("").setId("saveLabel1");
  var saveLabel2 = app.createLabel("").setId("saveLabel2");
  var saveLabel3 = app.createLabel("").setId("saveLabel3");
  var saveLabel4 = app.createLabel("").setId("saveLabel4");
  var saveLabel5 = app.createLabel("").setId("saveLabel5");  
  
//COLOURS
  var plain = "#FFFFFF";
  var light = "#F4F4F4";
  var mid = "#E0E0E0";
  var dark = "#606060";
  var title = "#00b6de";
  var saveBar = "#61c1f1";
  var saveButton = "#c1d82f";  
  
//STYLES
  var headerStyle = {width: "100%", height: "30px", color: dark, background: title, fontSize: "20px", lineHeight: "30px"};
  var borderStyle = "1px solid #E0E0E0";
 
//BASIC INFORMATION
//TITLE  
  var basicInfoTitle = app.createGrid(1, 1)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)  
                          .setText(0, 0, "Basic information").setStyleAttribute(0, 0, "fontSize", "20px")
                          .setStyleAttributes(headerStyle);
  
//GRID
  var basicInfoGrid = app.createGrid(8, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10) 
                         .setStyleAttributes({background: light})
                         .setRowStyleAttributes(0, {backgroundColor: dark, color: mid, height: "50px"})
                         .setRowStyleAttributes(1, {backgroundColor: dark, color: mid, height: "50px"})
                         .setText(0, 0, "Document ID").setStyleAttribute(0, 0, "width", "200px").setWidget(0, 1, docIdLabel)  
                         .setText(1, 0, "Author").setWidget(1, 1, authorLabel)  
                         .setText(2, 0, "Unit title").setWidget(2, 1, titleText)  
                         .setText(3, 0, "Date created").setWidget(3, 1, datePick)  
                         .setText(4, 0, "Subject").setWidget(4, 1, subjectList)           
                         .setText(5, 0, "Year").setWidget(5, 1, yearText)           
                         .setText(6, 0, "Term").setWidget(6, 1, termText)           
                         .setText(7, 0, "Length").setWidget(7, 1, lengthText);
//SAVE
  var basicInfoSave = app.createGrid(1, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(0)
                         .setWidget(0,0, saveLabel1)
                         .setStyleAttribute(0, 0, "text-align", "right")
                         .setStyleAttribute(0, 0, "color", plain)
                         .setWidget(0, 1, saveBtnOne
                           .setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                         .setStyleAttribute(0, 1, "text-align", "right")
                         .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                         .setStyleAttribute(0, 0, "width", "820px");
                         
//BIG PICTURE
//TITLE
  var bigPictureTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Big picture").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);
  
//GRID
  var bigPictureGrid = app.createGrid(3, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10) 
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Unit description").setWidget(0, 1, unitText).setStyleAttribute(0, 0, "width", "200px")           
                          .setText(1, 0, "Conceptual lens").setWidget(1, 1, conceptText)           
                          .setText(2, 0, "Relevance to real life").setWidget(2, 1, relevantText);
                          
//SAVE
  var bigPictureSave = app.createGrid(1, 2)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(0)
                           .setWidget(0,0, saveLabel2)
                           .setStyleAttribute(0, 0, "text-align", "right")
                           .setStyleAttribute(0, 0, "color", plain)
                           .setWidget(0, 1, saveBtnTwo
                           .setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                           .setStyleAttribute(0, 1, "text-align", "right")
                           .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                           .setStyleAttribute(0, 0, "width", "820px");
                            
//GOALS
//TITLE
  var goalsTitle = app.createGrid(1, 1)
                      .setBorderWidth(0)
                      .setCellSpacing(0)
                      .setCellPadding(10)
                      .setStyleAttribute("marginTop", "30px")
                      .setText(0, 0, "Learning goals and skills").setStyleAttribute(0, 0, "fontSize", "20px")
                      .setStyleAttributes(headerStyle);
                      
//GOALS GRIDTOP
  var goalsGridTop = app.createGrid(1, 2)
                        .setBorderWidth(0)
                        .setCellSpacing(0)
                        .setCellPadding(10)
                        .setStyleAttributes({background: light})
                        .setText(0, 0, "Curriculum learning goals").setWidget(0, 1, curricText).setStyleAttribute(0, 0, "width", "200px");
                        
//CREATE CHECKBOXES
  var chk_01 = app.createCheckBox().setName("chk_01");
  var chk_02 = app.createCheckBox().setName("chk_02");
  var chk_03 = app.createCheckBox().setName("chk_03");
  var chk_04 = app.createCheckBox().setName("chk_04");
  var chk_05 = app.createCheckBox().setName("chk_05");
  var chk_06 = app.createCheckBox().setName("chk_06");  
  var chk_07 = app.createCheckBox().setName("chk_07");  
  var chk_08 = app.createCheckBox().setName("chk_08");  
  var chk_09 = app.createCheckBox().setName("chk_09");  
  var chk_10 = app.createCheckBox().setName("chk_10");  
  var chk_11 = app.createCheckBox().setName("chk_11");  
  var chk_12 = app.createCheckBox().setName("chk_12");  
  var chk_13 = app.createCheckBox().setName("chk_13");  
  var chk_14 = app.createCheckBox().setName("chk_14");  
  var chk_15 = app.createCheckBox().setName("chk_15");
  var chk_16 = app.createCheckBox().setName("chk_16");  
  var chk_17 = app.createCheckBox().setName("chk_17");  
  var chk_18 = app.createCheckBox().setName("chk_18");  
  var chk_19 = app.createCheckBox().setName("chk_19");
  var chk_20 = app.createCheckBox().setName("chk_20");
  
  var goalsText = "Identify only the one or two skills that will be explicitly taught within this unit.";
  var techLabel = app.createLabel("Technical skills").setTitle(goalsText);
  var learnLabel = app.createLabel("Learning skills").setTitle(goalsText);
  var persLabel = app.createLabel("Personal skills").setTitle(goalsText);
  var thinkLabel = app.createLabel("Thinking skills").setTitle(goalsText);
  
  var checkGrid = app.createGrid(8, 6).setWidth("708px").setStyleAttributes({borderCollapse: "collapse"})
                     .setBorderWidth(0)
                     .setCellSpacing(0)
                     .setCellPadding(10)
                     .setWidget(0, 1, techLabel)
                     .setWidget(0, 3, learnLabel)
                     .setWidget(0, 5, persLabel)
                     .setWidget(4, 1, thinkLabel)
                     .setWidget(1, 0, chk_01).setText(1, 1, "Information and media literacy")
                     .setWidget(1, 2, chk_02).setText(1, 3, "Taking initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital application")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquiring")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Planning")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborating")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicating")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflecting / reviewing")
                     .setWidget(7, 4, chk_20).setText(7, 5, "Resilient / resourceful");  
  
//GOALS GRIDBOTTOM
  var goalsGridBottom = app.createGrid(1, 2).setStyleAttributes({backgroundColor: light})
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)                           
                           .setText(0, 0, "Personal and transferable skills (PATS)").setWidget(0, 1, checkGrid);
                           
  checkGrid.setStyleAttributes({backgroundColor: plain})
           .setColumnStyleAttribute(0, "width", "20px")
           .setColumnStyleAttribute(1, "width", "200px")         
           .setColumnStyleAttribute(3, "width", "200px")         
           .setColumnStyleAttribute(5, "width", "200px")
           .setStyleAttributes(0, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 1, {color: dark,borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 2, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 3, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 4, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 5, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(4, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(4, 1, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid, fontWeight: "bold"})
           .setRowStyleAttributes(7, {borderBottom: borderStyle})
           .setColumnStyleAttributes(0, {borderLeft: borderStyle})
           .setColumnStyleAttributes(2, {borderLeft: borderStyle})
           .setColumnStyleAttributes(4, {borderLeft: borderStyle})
           .setColumnStyleAttributes(5, {borderRight: borderStyle});
 
//GOALS SAVE
  var goalsSave = app.createGrid(1, 2)
                     .setBorderWidth(0)
                     .setCellSpacing(0)
                     .setCellPadding(0)
                     .setWidget(0,0, saveLabel3)
                     .setStyleAttribute(0, 0, "text-align", "right")
                     .setStyleAttribute(0, 0, "color", plain)
                     .setWidget(0, 1, saveBtnThree.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                     .setStyleAttribute(0, 1, "text-align", "right")
                     .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                     .setStyleAttribute(0, 0, "width", "820px");
  
//INTENTIONS
//INTENTIONS TITLE
  var intentionsTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Learning intentions").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);
                           
//INTENTIONS GRID
  var intentionsGrid = app.createGrid(7, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Key concepts").setStyleAttribute(0,0, "width", "200px").setWidget(0, 1, keyText)           
                          .setText(1, 0, "Understanding").setWidget(1, 1, underText)           
                          .setText(2, 0, "Debatable guiding question/s").setWidget(2, 1, debatableText)      
                          .setText(3, 0, "Conceptual guiding question/s").setWidget(3, 1, conceptualText)      
                          .setText(4, 0, "Factual guiding question/s").setWidget(4, 1, factualText)           
                          .setText(5, 0, "Knowledge").setWidget(5, 1, knowText)           
                          .setText(6, 0, "Skills").setWidget(6, 1, skillText);
                          
//INTENTIONS SAVE
  var intentionsSave = app.createGrid(1, 2)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(0)
                           .setWidget(0,0, saveLabel4)
                           .setStyleAttribute(0, 0, "text-align", "right")
                           .setStyleAttribute(0, 0, "color", plain)
                           .setWidget(0, 1, saveBtnFour.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                           .setStyleAttribute(0, 1, "text-align", "right")
                           .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                           .setStyleAttribute(0, 0, "width", "820px");
//EVALUATION
//EVALUATION TITLE
  var evaluationTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Learning evaluation").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);

//EVALUATION GRID
  var evaluationGrid = app.createGrid(2, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Success criteria").setWidget(0, 1, successText).setStyleAttribute(0, 0, "width", "200px")           
                          .setText(1, 0, "Assessment evidence").setWidget(1, 1, assessText);

//EVALUATION SAVE
  var evaluationSave = app.createGrid(1, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(0)
                          .setWidget(0,0, saveLabel5)
                          .setStyleAttribute(0, 0, "text-align", "right")
                          .setStyleAttribute(0, 0, "color", plain)
                          .setWidget(0, 1, saveBtnFive.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                          .setStyleAttribute(0, 1, "text-align", "right")
                          .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                          .setStyleAttribute(0, 0, "width", "820px");         
  
//HANDLERS
  var saveHandler = app.createServerClickHandler('save');
  saveHandler.addCallbackElement(flow);
  
  var saveLabelHandler = app.createClientHandler().forTargets(saveLabel1, saveLabel2, saveLabel3, saveLabel4, saveLabel5).setText("saving...");
    
  var disableHandler = app.createClientHandler().forTargets(saveBtnOne, saveBtnTwo, saveBtnThree, saveBtnFour, saveBtnFive).setEnabled(false);
  
//ADD HANDLERS
  saveBtnOne.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnTwo.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnThree.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnFour.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnFive.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  
//PANEL STRUCTURE
  flow.add(basicInfoTitle)
      .add(basicInfoGrid)
      .add(basicInfoSave)
      .add(bigPictureTitle)
      .add(bigPictureGrid)
      .add(bigPictureSave)
      .add(goalsTitle)
      .add(goalsGridTop)
      .add(goalsGridBottom)
      .add(goalsSave)
      .add(intentionsTitle)
      .add(intentionsGrid)
      .add(intentionsSave)
      .add(evaluationTitle)
      .add(evaluationGrid)
      .add(evaluationSave);
      
  app.add(flow);
  
  return app;
  
 }

///{{{{{{{{{{{{{{{{{{{{{{{{{ SAVE }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function save(e){
  Logger.log("running save function");
//GET APP VARIABLES
  var app = UiApp.getActiveApplication();  
  var saveLabels = ["saveLabel1", "saveLabel2", "saveLabel3", "saveLabel4", "saveLabel5"];  
  var docIdLabel = app.getElementById("docId");
  var saveBtnOne = app.getElementById("saveBtnOne");
  var saveBtnTwo = app.getElementById("saveBtnTwo");
  var saveBtnThree = app.getElementById("saveBtnThree");
  var saveBtnFour = app.getElementById("saveBtnFour");
  var saveBtnFive = app.getElementById("saveBtnFive");

//GET FORM OUTPUT
  var docId = e.parameter.docId_tag;
  var dateCreatedText = e.parameter.dateText.toString();
  var title = e.parameter.titleText;
  var subjectText = e.parameter.subjectText;
  var subjectIndex = subjectArray.indexOf(subjectText);  
  var department = "=VLOOKUP(R[0]C[-2],Publishers,3,FALSE)";
  var authorText = e.parameter.authorText_tag
  var publisherFormula = "=VLOOKUP(R[0]C[-4],Publishers,2,FALSE)";
  var year = e.parameter.yearText;
  var yearIndex = yearArray.indexOf(year);
  var group = "=VLOOKUP(R[0]C[-2],yearToGroup,2,FALSE)";
  var term = e.parameter.termText;
  var termIndex = termArray.indexOf(term); 
  var length = e.parameter.lengthText;
  var conceptLens = e.parameter.conceptText;
  var conceptualIndex = conceptualArray.indexOf(conceptLens);
  var keyConcepts = e.parameter.keyText;
  var unitText = e.parameter.unitText;
  var relevantText = e.parameter.relevantText;
  var curricText = e.parameter.curricText;
  var underText = e.parameter.underText;
  var debatableText = e.parameter.debatableText;
  var conceptualText = e.parameter.conceptualText;
  var factualText = e.parameter.factualText;
  var knowText = e.parameter.knowText;
  var skillText = e.parameter.skillText;
  var successText = e.parameter.successText;
  var assessText = e.parameter.assessText;
  var docUrl = "";
    
//GET CHECKBOX OUTPUT
  var chk_01 = e.parameter.chk_01;
  var chk_02 = e.parameter.chk_02;
  var chk_03 = e.parameter.chk_03;
  var chk_04 = e.parameter.chk_04;
  var chk_05 = e.parameter.chk_05;
  var chk_06 = e.parameter.chk_06;
  var chk_07 = e.parameter.chk_07;
  var chk_08 = e.parameter.chk_08;
  var chk_09 = e.parameter.chk_09;
  var chk_10 = e.parameter.chk_10;
  var chk_11 = e.parameter.chk_11;
  var chk_12 = e.parameter.chk_12;
  var chk_13 = e.parameter.chk_13;
  var chk_14 = e.parameter.chk_14;
  var chk_15 = e.parameter.chk_15;
  var chk_16 = e.parameter.chk_16;
  var chk_17 = e.parameter.chk_17;
  var chk_18 = e.parameter.chk_18;
  var chk_19 = e.parameter.chk_19;
  var chk_20 = e.parameter.chk_20;
  
//SET SPREADSHEET DETAILS
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  var subjectSheet = ss.getSheetByName(subjectText);  
  var isNew = false;
  var isUpdate = false;
  var isCopy = false;  
  var docId = e.parameter.docId_tag;
  
//DETERMINE IF NEW RECORD
  if(docId == ""){
    isNew = true;
    docId = new Date().getTime().toString();
  } 
  
  var statusValues = [docId, dateCreatedText, title, subjectText, authorText, year, group, term, conceptLens, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length];
  
//STATUS CALC
  var statusCount = 0;
  var checkCount = 0;
  
  for(var i = 0; i < statusValues.length; i++){    
    if(statusValues[i] == "true"){      
      checkCount = checkCount +1      
    }    
    if(statusValues[i] != ""){    
      statusCount = statusCount + 1;    
    }
  }
  
  
  statusCount = statusCount - 20;
  
  if(checkCount > 0){
    statusCount = statusCount + 1
  }
  
  var status = ((statusCount/23)*100).toFixed(0) + "%";

//SET VALUE ARRAYS AND OBJECTS - YES, RIDICULOUS
  var values = [docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20, docUrl];
                
  var values2 = [[docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                  chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20, docUrl]];
                  
  var valuesFull = [docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex,  group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length, docUrl];
                    
  var valuesFull2 = [[docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length, docUrl]];
  

//MOVED VARIABLE SO AS TO ENABLE MAILING ON 100%
  var recordRange = libSheet.getLastRow()-1; 
  var libRange = libSheet.getRange(2, 1, recordRange, 38);
  var recordObjects = getRowsData(libSheet, libRange);
  var recordMatchRow = 0;
  var subjectMatchRow = 0;
  
//IF NEW APPEND TO SHEET AS NEW RECORD ROW
  if(isNew == true){
    libSheet.appendRow(values);
    subjectSheet.appendRow(valuesFull);    
    docIdLabel.setText(docId).setTag(docId);
    
    for(var i = 0; i < saveLabels.length; i++){    
        var label = app.getElementById(saveLabels[i]);
        label.setText("");
    }
    
    if(status ==  "100%"){
      
        MailApp.sendEmail({
          to: recordObjects[recordMatchRow].publisher,
          subject: "Scope document awaiting publishing",
          htmlBody:  "Hello, <br><br>" +           
                    "The following document status is now 100% complete.<br><br>" +
                    "<b>Document title: </b>" + title + "<br>" +
                    "<b>Subject: </b>" + subjectText + "<br>" +
                    "<b>Author: </b>" + recordObjects[recordMatchRow].author + "<br><br><br>" +
                    "Access the system here: https://sites.google.com/a/nexus.edu.my/nexus-curriculum-planning/home",
        });  
      
    };
    
    saveBtnOne.setEnabled(true);
    saveBtnTwo.setEnabled(true);
    saveBtnThree.setEnabled(true);
    saveBtnFour.setEnabled(true);
    saveBtnFive.setEnabled(true);
    
    return app;
  }
  
//IF NOT NEW CONTINUE AND CREATE ARRAY OF EXISTING RECORDS
 // var recordRange = libSheet.getLastRow()-1; 
  //var libRange = libSheet.getRange(2, 1, recordRange, 38);
 // var recordObjects = getRowsData(libSheet, libRange);
 // var recordMatchRow = 0;
 // var subjectMatchRow = 0;
 
//NEW UPDATE BLOCK
  for(var i = 0; i < recordObjects.length; i++){    
    if(recordObjects[i].documentId === docId && recordObjects[i].dateCreated === dateCreatedText && recordObjects[i].subject == subjectText){
      isUpdate = true;
      recordMatchRow = i+2;
    }
  }

  if(isUpdate == true){
    libSheet.getRange(recordMatchRow, 1, 1, 38).setValues(values2);
    
    var lastRow = subjectSheet.getLastRow();
    var subjectRecords = subjectSheet.getRange(1, 1, lastRow, 1).getValues();

    for(var i = 0; i < subjectRecords.length; i++){
      if(subjectRecords[i][0] == docId){
        subjectMatchRow = i+1;
        subjectSheet.getRange(subjectMatchRow, 1, 1, 50).setValues(valuesFull2);
      }  
    }
    
    for(var i = 0; i < saveLabels.length; i++){    
      var label = app.getElementById(saveLabels[i]);
      label.setText("");
    }
      
      if(status ==  "100%"){
        recordObjects = getRowsData(libSheet, libRange);
        recordMatchRow = recordMatchRow - 2;
        MailApp.sendEmail({
          to: recordObjects[recordMatchRow].publisher,
          subject: "Scope document awaiting publishing",
          htmlBody: "Hello, <br><br>" +           
                    "The following document status is now 100% complete.<br><br>" +
                    "<b>Document title: </b>" + title + "<br>" +
                    "<b>Subject: </b>" + subjectText + "<br>" +
                    "<b>Author: </b>" + recordObjects[recordMatchRow].author + "<br><br><br>" +
                    "Access the system here: https://sites.google.com/a/nexus.edu.my/nexus-curriculum-planning/home",
        });  
      
      };
      
      saveBtnOne.setEnabled(true);
      saveBtnTwo.setEnabled(true);
      saveBtnThree.setEnabled(true);
      saveBtnFour.setEnabled(true);
      saveBtnFive.setEnabled(true);
      
      return app;
  }

//IF NOT NEW AND NOT UPDATE CREATE NEW ID, COPY ALL OTHER DETAILS AND APPEND VALUES TO SPREADSHEET AS NEW RECORD
  docId = new Date().getTime().toString();
//SET VALUE ARRAYS AND OBJECTS AGAIN - YES, RIDICULOUS, apparently it would call docId value set earlier in the script, not the one reset above if i do not declare again
  values = [docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20, docUrl];
  valuesFull = [docId, dateCreatedText, title, subjectText, subjectIndex, department, authorText, publisherFormula, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length, docUrl];
                    
  libSheet.appendRow(values);
  subjectSheet.appendRow(valuesFull);
  
  docIdLabel.setText(docId).setTag(docId);
  
  for(var i = 0; i < saveLabels.length; i++){   
    var label = app.getElementById(saveLabels[i]);
    label.setText("");
  }
  
  Logger.log(status);
  if(status ==  "100%"){
    
    MailApp.sendEmail({
      to: recordObjects[recordMatchRow].publisher,
      subject: "Scope document awaiting publishing",
      htmlBody:  "Hello, <br><br>" +           
                    "The following document status is now 100% complete.<br><br>" +
                    "<b>Document title: </b>" + title + "<br>" +
                    "<b>Subject: </b>" + subjectText + "<br>" +
                    "<b>Author: </b>" + recordObjects[recordMatchRow].author + "<br><br><br>" +
                    "Access the system here: https://sites.google.com/a/nexus.edu.my/nexus-curriculum-planning/home",
    });  
  };  
  
  saveBtnOne.setEnabled(true);
  saveBtnTwo.setEnabled(true);
  saveBtnThree.setEnabled(true);
  saveBtnFour.setEnabled(true);
  saveBtnFive.setEnabled(true);
  
  return app;
  
}

///{{{{{{{{{{{{{{{{{{{{{{{{{ SEARCH DISPLAY }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

function searchDisplay(){
  Logger.log("running search display function");
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById("panel");
  panel.clear();
  
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  libSheet.getRange("AM1").setValue(0);
  
//COLORS
  var plain = "#FFFFFF";
  var light = "#F4F4F4";
  var mid = "#E0E0E0";
  var dark = "#606060";
  var titleColor = "#00b6de";
  var saveBar = "#61c1f1";
  var saveButton = "#c1d82f";

//STYLES
  var headerStyle = {color: dark, fontSize: "20px", width: "100%", height: "50px", lineHeight: "50px"};
  var smallBtnStyle = {width: "40px", height: "20px", fontSize: "10px", background: saveButton, color: dark};
  var largeBtnStyle = {width: "100px", height: "40px", fontSize: "14px", background: saveButton, color: dark};
  var borderStyle = "1px solid #E0E0E0";
  
//HANDLERS
  var searchRecordsHandler = app.createServerHandler("searchRecords").addCallbackElement(panel);
  
  
  var searchLabel = app.createLabel("Search the library").setStyleAttribute("fontSize", "20px").setStyleAttributes(headerStyle);
  var searchTitle = app.createGrid(1,2).setWidth("900px")
                       .setCellPadding(10)
                       .setStyleAttributes({background: titleColor, width: "900px"})
                       .setWidget(0, 0, searchLabel);
                       //.setWidget(0, 1, app.createButton("<B>search</B>").setStyleAttributes(largeBtnStyle).addClickHandler(searchRecordsHandler))
                       //.setStyleAttribute(0, 1, "text-align", "right");
  
  var returnAllCheck = app.createCheckBox("Show all").setName("returnAllCheck");
  
  var returnAllGrid = app.createGrid(1, 2)
                            .setBorderWidth(0)
                            .setCellSpacing(0)
                            .setCellPadding(10) 
                            .setStyleAttributes({background: light})
                            .setStyleAttribute(0, 0, "width", "165px")
                            .setText(0, 0, "Checking this option will return a list of ALL scope documents at 'Published' status")
                            .setWidget(0, 1, returnAllCheck);
  
  var titleText = app.createTextBox().setWidth("700px").setHeight("30px").setName("titleText").setStyleAttribute("fontSize", "20px")
                     .setTitle("A brief title describing this scope.");
  
  var ageRangeText = app.createListBox().setWidth("300px").setHeight("30px").setName("yearText")
                        .addItem("")
                        .addItem("Reception")
                        .addItem("Nursery")
                        .addItem("Year 1")
                        .addItem("Year 2")
                        .addItem("Year 3")
                        .addItem("Year 4")
                        .addItem("Year 5")
                        .addItem("Year 6")
                        .addItem("Year 7")
                        .addItem("Year 8")
                        .addItem("Year 9")
                        .addItem("Year 10")
                        .addItem("Year 11")
                        .addItem("Year 12")
                        .addItem("Year 13")
                        .addItem("EYS")
                        .addItem("MP1")
                        .addItem("MP2")
                        .addItem("MP3")
                        .addItem("MYS")
                        .addItem("IGCSE")
                        .addItem("IBDP");
  
  var termText = app.createListBox().setWidth("300px").setHeight("30px").setName("termText")
  for(var n = 0; n < termArray.length; n++){termText.addItem(termArray[n])};
    
  var subjectList = app.createListBox().setWidth("300px").setHeight("30px").setName("subjectText")
  for(var n = 0; n < subjectArray.length; n++){subjectList.addItem(subjectArray[n])};
                       
  var conceptText = app.createListBox().setWidth("300px").setHeight("30px").setName("conceptText").setTitle("The conceptual lens helps the learners develop \
the cognitive process of seeing patterns and connections to link different elements.");
  for(var n = 0; n < conceptualArray.length; n++){conceptText.addItem(conceptualArray[n])};
  
  var searchDividerOne = app.createGrid(1,1)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10)
                         .setStyleAttributes(0, 0, {width: "900px", height: "5px"})
                         .setStyleAttributes({background: saveBar});
  
  var keyMatchAll = app.createCheckBox("Match all").setValue(true).setName("keyMatchAll");
  
  var keyText = app.createTextArea().setWidth("700px").setVisibleLines(1).setStyleAttribute("maxWidth", "700px").setName("keyText")
                   .setTitle("A concept is a big idea represented by one or two words. It is timeless, universal and abstract \
e.g. patterns.");
  
  var keyMatchGrid = app.createGrid(1, 2)
                            .setBorderWidth(0)
                            .setCellSpacing(0)
                            .setCellPadding(10) 
                            .setStyleAttributes({background: light})
                            .setStyleAttribute(0, 0, "width", "165px")
                            .setText(0, 0, "This option allows you to specify whether your search should match all OR any of the key concepts")
                            .setWidget(0, 1, keyMatchAll);  
  
  var searchDividerTwo = app.createGrid(1,1)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10)
                         .setStyleAttributes(0, 0, {width: "900px", height: "5px"})
                         .setStyleAttributes({background: saveBar});
  
  var checkMatchAll = app.createCheckBox("Match all").setValue(true).setName("checkMatchAll");
  
  var checkMatchGrid = app.createGrid(1, 2)
                            .setBorderWidth(0)
                            .setCellSpacing(0)
                            .setCellPadding(10) 
                            .setStyleAttributes({background: light})
                            .setStyleAttribute(0, 0, "width", "165px")
                            .setText(0, 0, "This option allows you to specify whether your search should match all OR any of the PATS selected")
                            .setWidget(0, 1, checkMatchAll);
                            
  var searchGrid = app.createGrid(5, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10) 
                         .setStyleAttributes({marginTop: '0px', background: light})
                         .setStyleAttribute(0, 0, "width", "200px")
                         .setText(0, 0, "Unit title").setWidget(0, 1, titleText)  
                         .setText(1, 0, "Subject").setWidget(1, 1, subjectList)           
                         .setText(2, 0, "Age range").setWidget(2, 1, ageRangeText)           
                         .setText(3, 0, "Term").setWidget(3, 1, termText)
                         .setText(4, 0, "Conceptual lens").setWidget(4, 1, conceptText)
                         
  var keySearchGrid = app.createGrid(1, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10) 
                         .setStyleAttributes({marginTop: '0px', background: light})
                         .setStyleAttribute(0, 0, "width", "200px")
                         .setText(0, 0, "Key concepts").setWidget(0, 1, keyText);                        
                        
//CREATE CHECKBOXES
  var chk_01 = app.createCheckBox().setName("chk_01");
  var chk_02 = app.createCheckBox().setName("chk_02");
  var chk_03 = app.createCheckBox().setName("chk_03");
  var chk_04 = app.createCheckBox().setName("chk_04");
  var chk_05 = app.createCheckBox().setName("chk_05");
  var chk_06 = app.createCheckBox().setName("chk_06");  
  var chk_07 = app.createCheckBox().setName("chk_07");  
  var chk_08 = app.createCheckBox().setName("chk_08");  
  var chk_09 = app.createCheckBox().setName("chk_09");  
  var chk_10 = app.createCheckBox().setName("chk_10");  
  var chk_11 = app.createCheckBox().setName("chk_11");  
  var chk_12 = app.createCheckBox().setName("chk_12");  
  var chk_13 = app.createCheckBox().setName("chk_13");  
  var chk_14 = app.createCheckBox().setName("chk_14");  
  var chk_15 = app.createCheckBox().setName("chk_15");
  var chk_16 = app.createCheckBox().setName("chk_16");  
  var chk_17 = app.createCheckBox().setName("chk_17");  
  var chk_18 = app.createCheckBox().setName("chk_18");  
  var chk_19 = app.createCheckBox().setName("chk_19");
  var chk_20 = app.createCheckBox().setName("chk_20");
  
  var techLabel = app.createLabel("Technical skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var learnLabel = app.createLabel("Learning skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var persLabel = app.createLabel("Personal skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var thinkLabel = app.createLabel("Thinking skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  
  var checkGrid = app.createGrid(8, 6).setWidth("700px").setStyleAttributes({borderCollapse: "collapse"})
                     .setBorderWidth(0)
                     .setCellSpacing(0)
                     .setCellPadding(10)
                     .setWidget(0, 1, techLabel)
                     .setWidget(0, 3, learnLabel)
                     .setWidget(0, 5, persLabel)
                     .setWidget(4, 1, thinkLabel)
                     .setWidget(1, 0, chk_01).setText(1, 1, "Information and media literacy")
                     .setWidget(1, 2, chk_02).setText(1, 3, "Taking initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital application")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquiring")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Planning")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborating")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicating")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflecting / reviewing")
                     .setWidget(7, 4, chk_20).setText(7, 5, "Resilient / resourceful");  
  
//GOALS GRIDBOTTOM
  var goalsGridBottom = app.createGrid(1, 2).setStyleAttributes({backgroundColor: light})
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)                           
                           .setText(0, 0, "Personal and transferable skills (PATS)").setWidget(0, 1, checkGrid);
                           
  checkGrid.setStyleAttributes({backgroundColor: plain})
           .setColumnStyleAttribute(0, "width", "20px")
           .setColumnStyleAttribute(1, "width", "200px")         
           .setColumnStyleAttribute(3, "width", "200px")         
           .setColumnStyleAttribute(5, "width", "200px")
           .setStyleAttributes(0, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 1, {color: dark,borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 2, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 3, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 4, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 5, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(4, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(4, 1, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid, fontWeight: "bold"})
           .setRowStyleAttributes(7, {borderBottom: borderStyle})
           .setColumnStyleAttributes(0, {borderLeft: borderStyle})
           .setColumnStyleAttributes(2, {borderLeft: borderStyle})
           .setColumnStyleAttributes(4, {borderLeft: borderStyle})
           .setColumnStyleAttributes(5, {borderRight: borderStyle});
           
  var searchBtn = app.createButton("<B>search</B>").setId("search")
                     .setStyleAttributes(largeBtnStyle)
                     .addClickHandler(searchRecordsHandler);
                  
  
  var disableHandler = app.createClientHandler().forTargets(searchBtn).setEnabled(false);
 
  
  var searchProgressLabel = app.createLabel("").setId("searchProgress").setStyleAttribute("color", plain);
  var searchDialogHandler = app.createClientHandler().forTargets(searchProgressLabel).setText("Search in progress...");
  searchBtn.addClickHandler(disableHandler).addClickHandler(searchDialogHandler);
  
  var searchEndTitle = app.createGrid(1,2).setWidth("900px")
                          .setCellPadding(10)
                          .setStyleAttributes({background: titleColor, width: "900px"})
                          .setWidget(0, 0, searchProgressLabel)
                          .setWidget(0, 1, searchBtn)
                          .setStyleAttribute(0, 0, "width", "760px")
                          .setStyleAttribute(0, 0, "text-align", "right")
                          .setStyleAttribute(0, 1, "text-align", "right");
                          
                          
  var recordFlex = app.createFlexTable().setId("recordFlex")
                      .setStyleAttributes({marginTop: "10px", marginLeft: "10px", width: "880px", borderCollapse: "collapse", border: "1px solid #606060"})
                      .setCellPadding(5)
                      .setBorderWidth(1);
                
  panel.add(searchTitle);
  panel.add(returnAllGrid);
  panel.add(searchGrid);
  panel.add(searchDividerOne);
  panel.add(keyMatchGrid);
  panel.add(keySearchGrid);
  panel.add(searchDividerTwo);
  panel.add(checkMatchGrid);
  panel.add(goalsGridBottom);
  panel.add(searchEndTitle);
  panel.add(recordFlex);
  
  return app

}

//{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ SEARCH RECORDS }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function searchRecords(e){

  Logger.log("Search records function running");
  var startTime = new Date();
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById("panel");
  var recordFlex = app.getElementById("recordFlex");
  var searchBtn = app.getElementById("search");
  var searchProgressLabel = app.getElementById("searchProgress");
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  var libRange = libSheet.getRange(2, 1, libSheet.getLastRow()-1, 38);
  var libraryObjects = getRowsData(libSheet, libRange);
  var tableRowCount = libSheet.getRange("AM1").getValue();
  var user = Session.getActiveUser().getEmail();
  var editHandler = app.createServerHandler("editRecord");

  //COLORS
  var plain = "#FFFFFF";
  var light = "#F4F4F4";
  var mid = "#E0E0E0";
  var dark = "#606060";
  var titleColor = "#00b6de";
  var saveBar = "#61c1f1";
  var saveButton = "#c1d82f";  
  
  //STYLES
  var headerStyle = {color: dark, fontSize: "20px", width: "100%", height: "50px", lineHeight: "50px"};
  var smallBtnStyle = {width: "40px", height: "20px", fontSize: "10px", background: saveButton, color: dark};
  var largeBtnStyle = {width: "100px", height: "40px", fontSize: "14px", background: saveButton, color: dark};
  
  var returnAllText = e.parameter.returnAllCheck;
  
  //RETURN ALL
  if(returnAllText == "true"){ 
    recordFlex.clear();
    recordFlex.setWidget(0, 0, app.createLabel("Document ID")).setStyleAttribute(0, 0, "text-align", "center")
              .setWidget(0, 1, app.createLabel("Title")).setStyleAttribute(0, 1, "text-align", "center")
              .setWidget(0, 2, app.createLabel("Subject")).setStyleAttribute(0, 2, "text-align", "center")
              .setWidget(0, 3, app.createLabel("Date created")).setStyleAttribute(0, 3, "text-align", "center")
              .setWidget(0, 4, app.createLabel("Author")).setStyleAttribute(0, 4, "text-align", "center")
              .setWidget(0, 5, app.createLabel("Status")).setStyleAttribute(0, 5, "text-align", "center")
              .setRowStyleAttribute(0, "height", "40px")
              .setWidget(0, 6, app.createLabel(""));
     
    var editText = "";
    var openText = "";
  
      for(var i = 0; i < libraryObjects.length; i++){
    
        recordFlex.setWidget(i+1, 0, app.createLabel(libraryObjects[i].documentId)).setStyleAttribute(i+1, 0, "text-align", "center")
                  .setWidget(i+1, 1, app.createLabel(libraryObjects[i].title)).setStyleAttribute(i+1, 1, "text-align", "center")
                  .setWidget(i+1, 2, app.createLabel(libraryObjects[i].subject)).setStyleAttribute(i+1, 2, "text-align", "center")
                  .setWidget(i+1, 3, app.createLabel(shortDate(libraryObjects[i].dateCreated))).setStyleAttribute(i+1, 3, "text-align", "center")
                  .setWidget(i+1, 4, app.createLabel(libraryObjects[i].author)).setStyleAttribute(i+1, 4, "text-align", "center")
                  .setWidget(i+1, 5, app.createLabel(libraryObjects[i].status.toString())).setStyleAttribute(i+1, 5, "text-align", "center")
                  .setRowStyleAttribute(i+1, "height", "40px");
        
        var statusText = libraryObjects[i].status;
        
        if(statusText == "Published"){
          var openPanel = app.createVerticalPanel();
          var openBtn = app.createButton("open").setStyleAttributes(smallBtnStyle)
          var docLink = app.createAnchor("open", libraryObjects[i].docurl)
                           .setStyleAttributes({'zIndex':'10', 'position':'absolute', 'marginLeft':'10px', 'marginTop':'-22px', 'color':'transparent'});
          openPanel.add(openBtn).add(docLink);
          recordFlex.setWidget(i+1, 6, openPanel).setStyleAttribute(i+1, 6, "text-align", "center");        
        }else{
          recordFlex.setWidget(i+1, 6, app.createLabel(""));
        }        
    }    
  
    recordFlex.setColumnStyleAttribute(0, "width", "100px")
        .setColumnStyleAttribute(1, "width", "200px")
        .setColumnStyleAttribute(2, "width", "100px")
        .setColumnStyleAttribute(3, "width", "100px")
        .setColumnStyleAttribute(4, "width", "200px")
        .setColumnStyleAttribute(5, "width", "100px")
        .setColumnStyleAttribute(6, "width", "45px")
        .setRowStyleAttribute(0, "background", mid)
        .setStyleAttributes({background: plain});  
  
  libSheet.getRange("AM1").setValue(libraryObjects.length);
  var endTime = new Date();
  var totalTime = (endTime - startTime)/1000;
  var docsMatchedStr = libraryObjects.length + " documents matched (" + totalTime + " secs)";
  app.getElementById("searchProgress").setText(docsMatchedStr);
  searchBtn.setEnabled(true)
  return app;
  
  }
  
  //BEGIN SEARCH  
  
  //manipulate title text
  var titleText = e.parameter.titleText;
  var titleTextReplaced = titleText.replace(/[^a-zA-Z ]+/ig, '');  
  var titleTextClean = titleTextReplaced.toLowerCase();
  
  //dropdown values  
  var subjectText = e.parameter.subjectText;
  var ageRangeText = e.parameter.yearText;
  var termText = e.parameter.termText;
  var conceptText = e.parameter.conceptText;
  
  //key concepts
  var keyMatchAll = e.parameter.keyMatchAll
  var keyText = e.parameter.keyText;
  var keyTextLower = keyText.toLowerCase();
  var keyTextArray = keyTextLower.split(", ");
  
  //PATS checkboxes
  var checkMatchAll = e.parameter.checkMatchAll;
    
  //section flags and arrays
  var sectionOne = false;
  var sectionTwo = false;
  var sectionTwoReq = 0;
  var sectionTwoCount = 0;
  var sectionThree = false;
  var keyCount = 0;
  var sectionFour = false;
  var patsSearchReq = 0;
  var checkCount = 0;
  var checkError = 0;
  var matchedIdArray = [];
  
  if(subjectText != ""){sectionTwoReq++;}
  if(ageRangeText != ""){sectionTwoReq++;}
  if(termText != ""){sectionTwoReq++;}
  if(conceptText != ""){sectionTwoReq++;}
  
  for(var i = 0; i < libraryObjects.length; i++){
    
    //title
    if(titleTextClean == "" || libraryObjects[i].title.toLowerCase().indexOf(titleTextClean) != -1){sectionOne = true;}
    
    //drop downs
    if(sectionTwoReq == 0){
      sectionTwo = true;
    }else{
      if(subjectText == libraryObjects[i].subject){sectionTwoCount = sectionTwoCount + 1;}
      if(ageRangeText == libraryObjects[i].group){sectionTwoCount = sectionTwoCount + 1;}
      if(termText == libraryObjects[i].term){sectionTwoCount = sectionTwoCount + 1;}
      if(conceptText == libraryObjects[i].conceptualLens){sectionTwoCount = sectionTwoCount + 1;}
    }
    
    if(sectionTwoCount == sectionTwoReq){sectionTwo = true;}
    sectionTwoCount = 0;
    
    //key concepts    
    if(keyText == ""){
      sectionThree = true;
    }else{
      //'match all' selected
      if(keyMatchAll == "true"){ 
        var libObjectsKey = libraryObjects[i].keyConcepts;
        var libObjectsKeyLower = libObjectsKey.toLowerCase()
        var libObjectsKeyArray = libObjectsKeyLower.split(", ");      
        for(var k = 0; k < keyTextArray.length; k++){        
          for(var j = 0; j < libObjectsKeyArray.length; j++){
            if(keyTextArray[k] == libObjectsKeyArray[j]){
              keyCount++
            }
          }
        }    
        if(keyCount == keyTextArray.length){sectionThree = true;}
      } 
  
      //'match all' unselected
      if(keyMatchAll == "false"){    
        var libObjectsKey = libraryObjects[i].keyConcepts;
        var libObjectsKeyLower = libObjectsKey.toLowerCase()
        var libObjectsKeyArray = libObjectsKeyLower.split(", ");
        for(var k = 0; k < keyTextArray.length; k++){        
          for(var j = 0; j < libObjectsKeyArray.length; j++){
            if(keyTextArray[k] == libObjectsKeyArray[j]){
              keyCount++          
            }
          }
        }
        if(keyCount > 0){sectionThree = true;}
        keyCount = 0;
      }
    }    
    
    //PATS checkboxes    
    for(var n = 0; n < 20; n++){
      var str = "chk_" + pad(n + 1);
      if(e.parameter[str] == "true"){
        patsSearchReq = 1;
        break;
      }
    }
    
    if(patsSearchReq != 1){
      sectionFour = true;
    }else{
      if(checkMatchAll == "true"){
        for(var m = 0; m < 20; m++){
          var str = "chk_" + pad(m + 1);
          if(e.parameter[str] == libraryObjects[i][patsKeyArray[m]].toString()){
            checkCount = checkCount + 1;
          }else{
            checkError = checkError + 1;
            break;
          }       
        }
         if(checkError == 0){sectionFour = true}
         checkCount = 0;
         checkError = 0;
      }
    
      if(checkMatchAll == "false"){
        for(var m = 0; m < 20; m++){
          var str = "chk_" + pad(m + 1);
          if(e.parameter[str] == "true" && libraryObjects[i][patsKeyArray[m]].toString() == "true"){
            checkCount = checkCount + 1;
            break;
          }else{
            checkError = checkError + 1;
          }       
        }
         if(checkCount > 0){sectionFour = true}
         checkCount = 0;
         checkError = 0;
      }    
    }
  

    //Logger.log("section one is: " + sectionOne);
    //Logger.log("section two is: " + sectionTwo);
    //Logger.log("section three is: " + sectionThree);
    //Logger.log("section four is: " + sectionFour);
    
    if(sectionOne == true && sectionTwo == true && sectionThree == true && sectionFour == true){matchedIdArray.push(libraryObjects[i].documentId);}
    
    sectionOne = false;
    sectionTwo = false;    
    sectionThree = false;
    sectionFour = false;
    
  }
  
  recordFlex.clear();
  if(tableRowCount > 0 || tableRowCount < matchedIdArray.length){
    var y = tableRowCount;
    var z = 0;  
    while(z < (tableRowCount - matchedIdArray.length)){
      recordFlex.removeRow(y);
      y--;
      z++;  
    }
  }
  
  recordFlex.setWidget(0, 0, app.createLabel("Document ID")).setStyleAttribute(0, 0, "text-align", "center")
            .setWidget(0, 1, app.createLabel("Title")).setStyleAttribute(0, 1, "text-align", "center")
            .setWidget(0, 2, app.createLabel("Subject")).setStyleAttribute(0, 2, "text-align", "center")
            .setWidget(0, 3, app.createLabel("Date created")).setStyleAttribute(0, 3, "text-align", "center")
            .setWidget(0, 4, app.createLabel("Author")).setStyleAttribute(0, 4, "text-align", "center")
            .setWidget(0, 5, app.createLabel("Status")).setStyleAttribute(0, 5, "text-align", "center")
            .setRowStyleAttribute(0, "height", "40px")
            .setWidget(0, 6, app.createLabel(""));
            
  for(var r = 0; r < matchedIdArray.length; r++){
    for(var s = 0; s < libraryObjects.length; s++){
      if(matchedIdArray[r] == libraryObjects[s].documentId){        
     
        var editText = "";
        var openText = "";
  
        recordFlex.setWidget(r + 1, 0, app.createLabel(libraryObjects[s].documentId)).setStyleAttribute(r + 1, 0, "text-align", "center")
                  .setWidget(r + 1, 1, app.createLabel(libraryObjects[s].title)).setStyleAttribute(r + 1, 1, "text-align", "center")
                  .setWidget(r + 1, 2, app.createLabel(libraryObjects[s].subject)).setStyleAttribute(r + 1, 2, "text-align", "center")
                  .setWidget(r + 1, 3, app.createLabel(shortDate(libraryObjects[s].dateCreated))).setStyleAttribute(r + 1, 3, "text-align", "center")
                  .setWidget(r + 1, 4, app.createLabel(libraryObjects[s].author)).setStyleAttribute(r + 1, 4, "text-align", "center")
                  .setWidget(r + 1, 5, app.createLabel(libraryObjects[s].status.toString())).setStyleAttribute(r + 1, 5, "text-align", "center")
                  .setRowStyleAttribute(r+1, "height", "40px");
        
        var statusText = libraryObjects[s].status;
        
        if(statusText == "Published"){
          var openPanel = app.createVerticalPanel();
          var openBtn = app.createButton("open").setStyleAttributes(smallBtnStyle)
          var docLink = app.createAnchor("open", libraryObjects[s].docurl)
                           .setStyleAttributes({'zIndex':'10', 'position':'absolute', 'marginLeft':'10px', 'marginTop':'-22px', 'color':'transparent'});
          openPanel.add(openBtn).add(docLink);
          recordFlex.setWidget(r + 1, 6, openPanel).setStyleAttribute(r + 1, 6, "text-align", "center");        
        }else{
          recordFlex.setWidget(r + 1, 6, app.createLabel(""));
        }        
      }  
    }
  }
  
  recordFlex//.setColumnStyleAttribute(0, "width", "100px")
            //.setColumnStyleAttribute(1, "width", "200px")
            //.setColumnStyleAttribute(2, "width", "100px")
           // .setColumnStyleAttribute(3, "width", "100px")
           // .setColumnStyleAttribute(4, "width", "200px")
           // .setColumnStyleAttribute(5, "width", "100px")
            .setColumnStyleAttribute(6, "width", "45px")
            .setRowStyleAttribute(0, "background", mid)
            .setStyleAttributes({background: plain});

  libSheet.getRange("AM1").setValue(matchedIdArray.length);
  var endTime = new Date();
  var totalTime = (endTime - startTime)/1000;
  var docsMatchedStr = matchedIdArray.length + " documents matched (" + totalTime + " secs)";
  app.getElementById("searchProgress").setText(docsMatchedStr);
  searchBtn.setEnabled(true);  
  return app;
}


///{{{{{{{{{{{{{{{{{{{{{{{{{ EDIT RECORD }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function editRecord(e) { 
  
  Logger.log("edit record function running");
  //GET RECORD ID AND INITIALISE SUBJECT VAR
  var source = e.parameter.source;
  var recordId = source.substr(8);
  var taskId = source.substr(0, 3);
  var isPublisher = false;
  
  var subjectSheetName = "";
  var missingLibraryRecord = true;
  var missingSubjectRecord = true;
  
  //SHEET
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  var pubSheet = ss.getSheetByName("Data");
  var libRange = libSheet.getRange(2, 1, libSheet.getLastRow() - 1, 4);
  var user = Session.getActiveUser().getEmail();
  var pubRange = pubSheet.getRange("Publishers")
  var pubObjects = getRowsData(pubSheet, pubRange);
  
  //DETERMINE IF USER IS PUBLISHER
  for(var i = 0; i < pubObjects.length; i++){  
    if(pubObjects[i].publisher == user){    
      isPublisher = true;
      break;
    }  
  }  
  
  //GET DOCUMENT AT LIBRARY LEVEL
  var recordObjects = getRowsData(libSheet, libRange);
  
  for(var i = 0; i < recordObjects.length; i++){  
    if(recordObjects[i].documentId == recordId){    
      subjectSheetName = recordObjects[i].subject;
      missingLibraryRecord = false;
      break;    
    } 
  }  
  
  if(missingLibraryRecord == true){  
    Logger.log("library record " + recordId + " missing");  
  }  

  //GET DOCUMENT AT SUBJECT LEVEL
  var subjectSheet = ss.getSheetByName(subjectSheetName);
  var subjectRange = subjectSheet.getRange(2, 1, subjectSheet.getLastRow() - 1, subjectSheet.getLastColumn());
  var subjectRecordObjects = getRowsData(subjectSheet, subjectRange);

  var recordRow = "";
  
 /* //function to get size of array by counting keys with corresponding values only   
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  // Get the size of an object
  var size = Object.size(subjectRecordObjects[0]); */
  
  for(var i = 0; i < subjectRecordObjects.length; i++){
    if(subjectRecordObjects[i].documentId == recordId){    
      recordRow = i;
      missingSubjectRecord = false;
      break;   
    }  
  }
    
  if(missingSubjectRecord == true){  
    Logger.log("subject record " + recordId + " missing");  
  }
  
  //SET DOCUMENT VARIABLES FROM FULL SUBJECT RECORD
  var titleTextValue = subjectRecordObjects[recordRow].title || ""; 
  var yearTextValue = subjectRecordObjects[recordRow].year || "";
  var yearIndex = subjectRecordObjects[recordRow].yearIndex || "";
  var termTextValue = subjectRecordObjects[recordRow].term || "";
  var termIndex = subjectRecordObjects[recordRow].termIndex || "";
  var lengthTextValue = subjectRecordObjects[recordRow].length || "";
  var subjectListValue = subjectRecordObjects[recordRow].subject || "";
  var subjectIndex = subjectRecordObjects[recordRow].subjectIndex || "";
  var datePickValue = subjectRecordObjects[recordRow].dateCreated || "";
  var unitTextValue = subjectRecordObjects[recordRow].unitDescription || "";
  var conceptTextValue = subjectRecordObjects[recordRow].conceptualLens || "";
  var conceptualIndex = subjectRecordObjects[recordRow].conceptualIndex || "";
  var relevantTextValue = subjectRecordObjects[recordRow].relevanceToRealLife || "";
  var curricTextValue = subjectRecordObjects[recordRow].curriculumLearningGoals || "";
  var keyTextValue = subjectRecordObjects[recordRow].keyConcepts || "";
  var underTextValue = subjectRecordObjects[recordRow].understanding || "";
  var debatableTextValue = subjectRecordObjects[recordRow].debatableGuidingQuestion || "";
  var conceptualTextValue = subjectRecordObjects[recordRow].conceptualGuidingQuestion || "";
  var factualTextValue = subjectRecordObjects[recordRow].factualGuidingQuestion || "";
  var knowTextValue = subjectRecordObjects[recordRow].knowledge || "";
  var skillTextValue = subjectRecordObjects[recordRow].skills || "";
  var successTextValue = subjectRecordObjects[recordRow].successCriteria || "";
  var assessTextValue = subjectRecordObjects[recordRow].assessmentEvidence || "";
  var chk_01Value = subjectRecordObjects[recordRow].informationAndMediaLiteracy;
  var chk_02Value = subjectRecordObjects[recordRow].takeInitiative;
  var chk_03Value = subjectRecordObjects[recordRow].knowledgeable;
  var chk_04Value = subjectRecordObjects[recordRow].criticalAnalysisAndEvaluation;
  var chk_05Value = subjectRecordObjects[recordRow].digitalApplicationsInMakingMovingImage;
  var chk_06Value = subjectRecordObjects[recordRow].enquire;
  var chk_07Value = subjectRecordObjects[recordRow].principled;
  var chk_08Value = subjectRecordObjects[recordRow].metacognition;   
  var chk_09Value = subjectRecordObjects[recordRow].researchSkills;   
  var chk_10Value = subjectRecordObjects[recordRow].planNarrativesMovingImageProduction;   
  var chk_11Value = subjectRecordObjects[recordRow].openMindedInternationallyMinded;   
  var chk_12Value = subjectRecordObjects[recordRow].problemSolving;   
  var chk_13Value = subjectRecordObjects[recordRow].collaborate;   
  var chk_14Value = subjectRecordObjects[recordRow].caring;   
  var chk_15Value = subjectRecordObjects[recordRow].synthesiseDesignCreateMake; 
  var chk_16Value = subjectRecordObjects[recordRow].courageous;   
  var chk_17Value = subjectRecordObjects[recordRow].communicate;   
  var chk_18Value = subjectRecordObjects[recordRow].balanced; 
  var chk_19Value = subjectRecordObjects[recordRow].reflectReview; 
  var chk_20Value = subjectRecordObjects[recordRow].resilientResourceful; 
  
  
  var app = UiApp.getActiveApplication();
  var displayPanel = app.getElementById("panel");
  app.remove(displayPanel);
  var flow = app.createFlowPanel().setSize("900px", "6000px");  
  var docId = recordId;  
  var docIdLabel = app.createLabel(docId).setId("docId").setTag(docId).setStyleAttribute("fontSize", "20px").setTitle("Automatically populated");  
  var author = subjectRecordObjects[recordRow].author;  
  var authorLabel = app.createLabel(author).setId("authorText").setTag(author).setStyleAttribute("fontSize", "20px").setTitle("Automatically populated");  
  var titleText = app.createTextBox().setWidth("700px").setHeight("30px").setName("titleText").setStyleAttribute("fontSize", "20px")
                     .setTitle("A brief title describing this scope.").setValue(titleTextValue);
  
  var yearText = app.createListBox().setWidth("300px").setHeight("30px").setName("yearText");
  for(var n = 0; n < yearArray.length; n++){yearText.addItem(yearArray[n])};
  if(yearIndex != 0){yearText.setItemSelected(yearIndex, true)};
  
  var termText = app.createListBox().setWidth("300px").setHeight("30px").setName("termText")
  for(var n = 0; n < termArray.length; n++){termText.addItem(termArray[n])};
  if(termText != 0){termText.setItemSelected(termIndex, true)};
  
  var lengthText = app.createTextBox().setWidth("294px").setHeight("30px").setName("lengthText").setTitle("The length of this piece of work, in weeks.").setValue(lengthTextValue);
  
  var subjectList = app.createListBox().setWidth("300px").setHeight("30px").setName("subjectText")
  for(var n = 0; n < subjectArray.length; n++){subjectList.addItem(subjectArray[n])};
  if(subjectIndex != 0){subjectList.setItemSelected(subjectIndex, true)};
  
  var datePick = app.createDateBox().setWidth("300px").setHeight("30px").setName("dateText").setValue(new Date(datePickValue));
  var unitText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("unitText")
                    .setTitle("A brief paragraph describing what the unit is concerned with for parents, \
learners and colleagues.").setValue(unitTextValue);
  
  var conceptText = app.createListBox().setWidth("300px").setHeight("30px").setName("conceptText");
  for(var n = 0; n < conceptualArray.length; n++){conceptText.addItem(conceptualArray[n])};
  if(conceptualIndex != 0){conceptText.setItemSelected(conceptualIndex, true)};
  
  var relevantText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("relevantText").setValue(relevantTextValue)
                        .setTitle("Why do they need to learn this? How does it help learners understand the world better?");
                        
  var curricText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("curricText").setValue(curricTextValue)
                      .setTitle("A goal is an end of key stage or end of year statement of attainment that all learners are expected to achieve.");
                      
  var keyText = app.createTextArea().setWidth("700px").setVisibleLines(1).setStyleAttribute("maxWidth", "700px").setName("keyText").setValue(keyTextValue)
                   .setTitle("A concept is a big idea represented by one or two words. It is timeless, universal and abstract \
e.g. patterns.");

  var underText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("underText").setValue(underTextValue)
                     .setTitle("Understandings (essential ideas or generalisations) are transferable - learners can apply their understanding \
to different situations.");
  
  var debatableText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("debatableText").setValue(debatableTextValue)
                         .setTitle("Intended to provoke debate and look at a problem from multiple perspectives.");
                         
  var conceptualText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("conceptualText").setValue(conceptualTextValue)
                          .setTitle("Questions that apply to other examples, other subjects or other situations. Normally 'why' questions.");
                          
  var factualText = app.createTextArea().setWidth("700px").setVisibleLines(2).setStyleAttribute("maxWidth", "700px").setName("factualText").setValue(factualTextValue)
                       .setTitle("Questions that have a right or wrong answer and needs to be known. Normally 'what' or 'how' questions.");  
  
  var knowText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("knowText").setValue(knowTextValue)
                    .setTitle("Information is made up of discrete facts which need to be remembered and can be tested. Knowledge is \
not necessarily transferable unlike understanding which is.");

  var skillText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("skillText").setValue(skillTextValue)
                     .setTitle("Knowledge of how to do something which can only be shown through demonstration.");
  
  var successText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("successText").setValue(successTextValue)
                       .setTitle("How will learners know and reflect on what they have learnt? \
Success criteria should be observable and measurable.");
  
  var assessText = app.createTextArea().setWidth("700px").setVisibleLines(6).setStyleAttribute("maxWidth", "700px").setName("assessText").setValue(assessTextValue)
                      .setTitle("What task or activity will give learners opportunity to demonstrate their understanding \
of the content, skills, essential ideas and key concepts that the unit has covered?");
  
//SAVE BUTTONS
  var saveBtnOne = app.createButton("<B>save</B>").setId("saveBtnOne");
  var saveBtnTwo = app.createButton("<B>save</B>").setId("saveBtnTwo");
  var saveBtnThree = app.createButton("<B>save</B>").setId("saveBtnThree");
  var saveBtnFour = app.createButton("<B>save</B>").setId("saveBtnFour");
  var saveBtnFive = app.createButton("<B>save</B>").setId("saveBtnFive");

//SAVE LABELS
  var saveLabel1 = app.createLabel("").setId("saveLabel1");
  var saveLabel2 = app.createLabel("").setId("saveLabel2");
  var saveLabel3 = app.createLabel("").setId("saveLabel3");
  var saveLabel4 = app.createLabel("").setId("saveLabel4");
  var saveLabel5 = app.createLabel("").setId("saveLabel5");

//PUBLISHING BUTTON
  var publishBtn = app.createButton("<B>publish</B>").setId(docId);

//PUBLISHING LABEL
  var publishLabel = app.createLabel("").setId("publishLabel");
  
//COLOURS
  var plain = "#FFFFFF";
  var light = "#F4F4F4";
  var mid = "#E0E0E0";
  var dark = "#606060";
  var title = "#00b6de";
  var saveBar = "#61c1f1";
  var saveButton = "#c1d82f";  
  
//STYLES
  var headerStyle = {width: "100%", height: "30px", color: dark, background: title, fontSize: "20px", lineHeight: "30px"};
  var borderStyle = "1px solid #E0E0E0";
 
//BASIC INFORMATION
//TITLE  
  var basicInfoTitle = app.createGrid(1, 1)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)  
                          .setText(0, 0, "Basic information").setStyleAttribute(0, 0, "fontSize", "20px")
                          .setStyleAttributes(headerStyle);
  
//GRID
  var basicInfoGrid = app.createGrid(8, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10) 
                         .setStyleAttributes({background: light})
                         .setRowStyleAttributes(0, {backgroundColor: dark, color: mid, height: "50px"})
                         .setRowStyleAttributes(1, {backgroundColor: dark, color: mid, height: "50px"})
                         .setText(0, 0, "Document ID").setStyleAttribute(0, 0, "width", "200px").setWidget(0, 1, docIdLabel)  
                         .setText(1, 0, "Author").setWidget(1, 1, authorLabel)  
                         .setText(2, 0, "Unit title").setWidget(2, 1, titleText)  
                         .setText(3, 0, "Date created").setWidget(3, 1, datePick)  
                         .setText(4, 0, "Subject").setWidget(4, 1, subjectList)           
                         .setText(5, 0, "Year").setWidget(5, 1, yearText)           
                         .setText(6, 0, "Term").setWidget(6, 1, termText)           
                         .setText(7, 0, "Length").setWidget(7, 1, lengthText);
//SAVE
  var basicInfoSave = app.createGrid(1, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(0)
                         .setWidget(0,0, saveLabel1)
                         .setStyleAttribute(0, 0, "text-align", "right")
                         .setStyleAttribute(0, 0, "color", plain)
                         .setWidget(0, 1, saveBtnOne
                           .setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                         .setStyleAttribute(0, 1, "text-align", "right")
                         .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                         .setStyleAttribute(0, 0, "width", "820px");
                         
//BIG PICTURE
//TITLE
  var bigPictureTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Big picture").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);
  
//GRID
  var bigPictureGrid = app.createGrid(3, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10) 
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Unit description").setWidget(0, 1, unitText).setStyleAttribute(0, 0, "width", "200px")           
                          .setText(1, 0, "Conceptual lens").setWidget(1, 1, conceptText)           
                          .setText(2, 0, "Relevance to real life").setWidget(2, 1, relevantText);
                          
//SAVE
  var bigPictureSave = app.createGrid(1, 2)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(0)
                           .setWidget(0,0, saveLabel2)
                           .setStyleAttribute(0, 0, "text-align", "right")
                           .setStyleAttribute(0, 0, "color", plain)
                           .setWidget(0, 1, saveBtnTwo
                           .setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                           .setStyleAttribute(0, 1, "text-align", "right")
                           .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                           .setStyleAttribute(0, 0, "width", "820px");
                            
//GOALS
//TITLE
  var goalsTitle = app.createGrid(1, 1)
                      .setBorderWidth(0)
                      .setCellSpacing(0)
                      .setCellPadding(10)
                      .setStyleAttribute("marginTop", "30px")
                      .setText(0, 0, "Learning goals and skills").setStyleAttribute(0, 0, "fontSize", "20px")
                      .setStyleAttributes(headerStyle);
                      
//GOALS GRIDTOP
  var goalsGridTop = app.createGrid(1, 2)
                        .setBorderWidth(0)
                        .setCellSpacing(0)
                        .setCellPadding(10)
                        .setStyleAttributes({background: light})
                        .setText(0, 0, "Curriculum learning goals").setWidget(0, 1, curricText).setStyleAttribute(0, 0, "width", "200px");
                        
//CREATE CHECKBOXES
  var chk_01 = app.createCheckBox().setName("chk_01").setValue(chk_01Value);
  var chk_02 = app.createCheckBox().setName("chk_02").setValue(chk_02Value);
  var chk_03 = app.createCheckBox().setName("chk_03").setValue(chk_03Value);
  var chk_04 = app.createCheckBox().setName("chk_04").setValue(chk_04Value);
  var chk_05 = app.createCheckBox().setName("chk_05").setValue(chk_05Value);
  var chk_06 = app.createCheckBox().setName("chk_06").setValue(chk_06Value);  
  var chk_07 = app.createCheckBox().setName("chk_07").setValue(chk_07Value);  
  var chk_08 = app.createCheckBox().setName("chk_08").setValue(chk_08Value);  
  var chk_09 = app.createCheckBox().setName("chk_09").setValue(chk_09Value);  
  var chk_10 = app.createCheckBox().setName("chk_10").setValue(chk_10Value);  
  var chk_11 = app.createCheckBox().setName("chk_11").setValue(chk_11Value);  
  var chk_12 = app.createCheckBox().setName("chk_12").setValue(chk_12Value);  
  var chk_13 = app.createCheckBox().setName("chk_13").setValue(chk_13Value);   
  var chk_14 = app.createCheckBox().setName("chk_14").setValue(chk_14Value);  
  var chk_15 = app.createCheckBox().setName("chk_15").setValue(chk_15Value);  
  var chk_16 = app.createCheckBox().setName("chk_16").setValue(chk_16Value);   
  var chk_17 = app.createCheckBox().setName("chk_17").setValue(chk_17Value);  
  var chk_18 = app.createCheckBox().setName("chk_18").setValue(chk_18Value);   
  var chk_19 = app.createCheckBox().setName("chk_19").setValue(chk_19Value);  
  var chk_20 = app.createCheckBox().setName("chk_20").setValue(chk_20Value);  
  
  var techLabel = app.createLabel("Technical skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var learnLabel = app.createLabel("Learning skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var persLabel = app.createLabel("Personal skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  var thinkLabel = app.createLabel("Thinking skills").setTitle("Identify only the one or two skills that will be explicitly taught within this unit.");
  
  var checkGrid = app.createGrid(8, 6).setWidth("708px").setStyleAttributes({borderCollapse: "collapse"})
                     .setBorderWidth(0)
                     .setCellSpacing(0)
                     .setCellPadding(10)
                     .setWidget(0, 1, techLabel)
                     .setWidget(0, 3, learnLabel)
                     .setWidget(0, 5, persLabel)
                     .setWidget(4, 1, thinkLabel)
                     .setWidget(1, 0, chk_01).setText(1, 1, "Information and media literacy")
                     .setWidget(1, 2, chk_02).setText(1, 3, "Taking initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital application")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquiring")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Planning")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborating")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicating")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflecting / reviewing")
                     .setWidget(7, 4, chk_20).setText(7, 5, "Resilient / resourceful"); 
  
//GOALS GRIDBOTTOM
  var goalsGridBottom = app.createGrid(1, 2).setStyleAttributes({backgroundColor: light})
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)                           
                           .setText(0, 0, "Personal and transferable skills (PATS)").setWidget(0, 1, checkGrid);
                           
  checkGrid.setStyleAttributes({backgroundColor: plain})
           .setColumnStyleAttribute(0, "width", "20px")
           .setColumnStyleAttribute(1, "width", "200px")         
           .setColumnStyleAttribute(3, "width", "200px")         
           .setColumnStyleAttribute(5, "width", "200px")
           .setStyleAttributes(0, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 1, {color: dark,borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 2, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 3, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(0, 4, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(0, 5, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, borderRight: "1px solid #FFFFFF", backgroundColor: mid, fontWeight: "bold"})
           .setStyleAttributes(4, 0, {borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid})
           .setStyleAttributes(4, 1, {color: dark, borderBottom: borderStyle, borderTop: borderStyle, backgroundColor: mid, fontWeight: "bold"})
           .setRowStyleAttributes(7, {borderBottom: borderStyle})
           .setColumnStyleAttributes(0, {borderLeft: borderStyle})
           .setColumnStyleAttributes(2, {borderLeft: borderStyle})
           .setColumnStyleAttributes(4, {borderLeft: borderStyle})
           .setColumnStyleAttributes(5, {borderRight: borderStyle});
 
//GOALS SAVE
  var goalsSave = app.createGrid(1, 2)
                     .setBorderWidth(0)
                     .setCellSpacing(0)
                     .setCellPadding(0)
                     .setWidget(0,0, saveLabel3)
                     .setStyleAttribute(0, 0, "text-align", "right")
                     .setStyleAttribute(0, 0, "color", plain)
                     .setWidget(0, 1, saveBtnThree.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                     .setStyleAttribute(0, 1, "text-align", "right")
                     .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                     .setStyleAttribute(0, 0, "width", "820px");
  
//INTENTIONS
//INTENTIONS TITLE
  var intentionsTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Learning intentions").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);
                           
//INTENTIONS GRID
  var intentionsGrid = app.createGrid(7, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Key concepts").setStyleAttribute(0,0, "width", "200px").setWidget(0, 1, keyText)           
                          .setText(1, 0, "Understanding").setWidget(1, 1, underText)           
                          .setText(2, 0, "Debatable guiding question").setWidget(2, 1, debatableText)      
                          .setText(3, 0, "Conceptual guiding question").setWidget(3, 1, conceptualText)      
                          .setText(4, 0, "Factual guiding question").setWidget(4, 1, factualText)           
                          .setText(5, 0, "Knowledge").setWidget(5, 1, knowText)           
                          .setText(6, 0, "Skills").setWidget(6, 1, skillText);
                          
//INTENTIONS SAVE
  var intentionsSave = app.createGrid(1, 2)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(0)
                           .setWidget(0,0, saveLabel4)
                           .setStyleAttribute(0, 0, "text-align", "right")
                           .setStyleAttribute(0, 0, "color", plain)
                           .setWidget(0, 1, saveBtnFour.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                           .setStyleAttribute(0, 1, "text-align", "right")
                           .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                           .setStyleAttribute(0, 0, "width", "820px");
//EVALUATION
//EVALUATION TITLE
  var evaluationTitle = app.createGrid(1, 1)
                           .setBorderWidth(0)
                           .setCellSpacing(0)
                           .setCellPadding(10)
                           .setStyleAttribute("marginTop", "30px")
                           .setText(0, 0, "Learning evaluation").setStyleAttribute(0, 0, "fontSize", "20px")
                           .setStyleAttributes(headerStyle);

//EVALUATION GRID
  var evaluationGrid = app.createGrid(2, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(10)
                          .setStyleAttributes({background: light})
                          .setText(0, 0, "Success criteria").setWidget(0, 1, successText).setStyleAttribute(0, 0, "width", "200px")           
                          .setText(1, 0, "Assessment evidence").setWidget(1, 1, assessText);

//EVALUATION SAVE
  var evaluationSave = app.createGrid(1, 2)
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(0)
                          .setWidget(0,0, saveLabel5)
                          .setStyleAttribute(0, 0, "text-align", "right")
                          .setStyleAttribute(0, 0, "color", plain)
                          .setWidget(0, 1, saveBtnFive.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                          .setStyleAttribute(0, 1, "text-align", "right")
                          .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                          .setStyleAttribute(0, 0, "width", "820px");
//PUBLISHING                          
//PUBLISHING TITLE
  var publishTitle = app.createGrid(1, 1)
                        .setBorderWidth(0)
                        .setCellSpacing(0)
                        .setCellPadding(10)
                        .setStyleAttribute("marginTop", "30px")
                        .setText(0, 0, "Publishing").setStyleAttribute(0, 0, "fontSize", "20px")
                        .setStyleAttributes(headerStyle);
//PUBLISHING GRID                           
  var publishGrid = app.createGrid(2, 1)
                       .setBorderWidth(0)
                       .setCellSpacing(0)
                       .setCellPadding(10)
                       .setStyleAttributes({background: light})
                       .setText(0, 0, "Publish this document?").setStyleAttribute(0, 0, "fontSize", "20px")
                       .setText(1, 0, "Before publishing please fully review this document.")
                       .setStyleAttribute(0, 0, "width", "900px");;
 
 var publishSave = app.createGrid(1, 2).setId("publishSave")
                          .setBorderWidth(0)
                          .setCellSpacing(0)
                          .setCellPadding(0)
                          .setWidget(0, 0, publishLabel)
                          .setStyleAttribute(0, 0, "text-align", "right")
                          .setStyleAttribute(0, 0, "color", plain)
                          .setWidget(0, 1, publishBtn.setStyleAttributes({background: saveButton, color: dark}).setSize("80px", "30px"))
                          .setStyleAttribute(0, 1, "text-align", "right")
                          .setRowStyleAttributes(0, {backgroundColor: saveBar, height: "40px"})
                          .setStyleAttribute(0, 0, "width", "820px");

//HANDLERS
  var saveHandler = app.createServerClickHandler('save');
  saveHandler.addCallbackElement(flow);
  
  var publishHandler = app.createServerClickHandler('publish');
  
  var saveLabelHandler = app.createClientHandler().forTargets(saveLabel1, saveLabel2, saveLabel3, saveLabel4, saveLabel5).setText("saving...");                            
  var publishLabelHandler = app.createClientHandler().forTargets(publishLabel).setText("publishing...");
  
  var disableHandler = app.createClientHandler().forTargets(saveBtnOne, saveBtnTwo, saveBtnThree, saveBtnFour, saveBtnFive).setEnabled(false);
  
//ADD HANDLERS
  saveBtnOne.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnTwo.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnThree.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnFour.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  saveBtnFive.addClickHandler(saveHandler).addClickHandler(saveLabelHandler).addClickHandler(disableHandler);
  publishBtn.addClickHandler(publishHandler).addClickHandler(publishLabelHandler);
  
//PANEL STRUCTURE
  flow.add(basicInfoTitle)
      .add(basicInfoGrid)
      .add(basicInfoSave)
      .add(bigPictureTitle)
      .add(bigPictureGrid)
      .add(bigPictureSave)
      .add(goalsTitle)
      .add(goalsGridTop)
      .add(goalsGridBottom)
      .add(goalsSave)
      .add(intentionsTitle)
      .add(intentionsGrid)
      .add(intentionsSave)
      .add(evaluationTitle)
      .add(evaluationGrid)
      .add(evaluationSave);
  
  Logger.log(subjectRecordObjects[recordRow].status);
  
  if(isPublisher == true && (subjectRecordObjects[recordRow].status == 1 || subjectRecordObjects[recordRow].status == "Published")){  
    flow.add(publishTitle)
        .add(publishGrid)
        .add(publishSave);  
  }
  
  app.add(flow);
  
  return app;
  
 }

///{{{{{{{{{{{{{{{{{{{{{{{{{ PUBLISHING }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function publish(e){
  
  Logger.log("running publish function");
  
  var recordId = e.parameter.source;
  var app = UiApp.getActiveApplication();
  var publishSave = app.getElementById("publishSave");
  var publishLabel = app.getElementById("publishLabel");
  
  var headerArray = ["Title", "Subject", "Department", "Author", "Publisher", "Group", "Year",
                      "Term", "Length", "Conceptual lens", "Key concepts", "Unit description", "Relevance to real life", "Curriculum learning goals",
                      "Understanding", "Debatable guiding question/s", "Conceptual guiding question/s", "Factual guiding question/s", "Knowledge", "Skills",
                      "Success criteria", "Assessment evidence"];
   
   var headerKeyArray = ["title", "subject", "department", "author", "publisher", "group", "year", "term", "length", "conceptualLens",
                   "keyConcepts", "unitDescription", "relevanceToRealLife", "curriculumLearningGoals", "understanding", "debatableGuidingQuestion", 
                   "conceptualGuidingQuestion", "factualGuidingQuestion", "knowledge", "skills", "successCriteria", "assessmentEvidence"];
                   
   var skillsKeyArray = ["takeInitiative", "enquire", "planNarrativesMovingImageProduction", "collaborate", "synthesiseDesignCreateMake", "communicate",
                         "reflectReview", "knowledgeable", "openMindedInternationallyMinded", "caring", "courageous", "balanced", "resilientResourceful",
                         "principled", "informationAndMediaLiteracy", "digitalApplicationsInMakingMovingImage", "researchSkills", "criticalAnalysisAndEvaluation",
                         "metacognition", "problemSolving"];
   
   var skillsArray = ["Taking initiative", "Enquiring", "Planning", "Collaborating", "Synthesising (design / create / make)",
                      "Communicating", "Reflecting / reviewing", "Knowledgeable", "Open minded", "Caring", "Courageous", "Balanced", "Resilient / resourceful",
                      "Principled", "Information and media literacy", "Digital application", "Research", "Critical (analysis and evaluation)", "Metacognition",
                      "Problem solving"];
                      
   //var logoFile = DriveApp.getFileById("0B_xDSSvcJgoIMEdNcjBWQmV5czQ").getBlob();

   var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
   var libSheet = ss.getSheetByName("Library");
   var libRange = libSheet.getRange(2, 1, libSheet.getLastRow() - 1, 4)
   var libObjects = getRowsData(libSheet, libRange);
   var subjectName = "";
   var libRecordRow = 0;
   //Logger.log(libObjects);
  // Logger.log(recordId);
  // Logger.log(libObjects[0].documentId);
  // Logger.log(libObjects[0].subject);
   for(var i = 0; i < libObjects.length; i++){
     if(libObjects[i].documentId == recordId){
       libRecordRow = i;
       subjectName = libObjects[i].subject;
       break;
     }   
   }
   
   var subjectSheet = ss.getSheetByName(subjectName);
   var subjectRange = subjectSheet.getRange(2, 1, subjectSheet.getLastRow() - 1, 50);
   var recordObjects = getRowsData(subjectSheet, subjectRange);
   var recordRow = 0;
   
   for(var i = 0; i < recordObjects.length; i++){
     if(recordObjects[i].documentId == recordId){
       recordRow = i;
       break;
     }   
   }
   //Logger.log(libObjects[0]);
  // Logger.log(recordObjects[0]);
   //Logger.log(recordObjects[1]);
   //Logger.log(recordId);
  //Logger.log(recordObjects[recordRow].documentId);
   //Logger.log(recordObjects[1].documentId)
  // Logger.log(recordObjects[2].documentId)
  // Logger.log(recordObjects[3].documentId)
   //Logger.log(libRecordRow + 2);
   //Logger.log(recordRow + 2);
   
   //return;
   
/*GET KEY WITH VALUE COUNT
   var count = 0;
   for (var k in recordObjects[0]) if (recordObjects[0].hasOwnProperty(k)) ++count;
   //Logger.log(count);

//GET KEY NAMES
   //var keys = [];
   //for(var k in recordObjects[0]) keys.push(k);*/ 

   var doc = DocumentApp.create(recordObjects[recordRow].title).addEditor(recordObjects[recordRow].author).addEditor(recordObjects[recordRow].publisher);
   var docId = doc.getId();
   var docUrl = doc.getUrl();
   var title = recordObjects[recordRow].title;
   var docFile = DocsList.getFileById(docId)
   
   docFile.addEditor(recordObjects[recordRow].author);
   Logger.log(recordObjects[recordRow].author);
   docFile.addEditor(recordObjects[recordRow].publisher);
   Logger.log(recordObjects[recordRow].publisher);
   var saveFolder = DocsList.getFolder('001_DOCS');
   docFile.addToFolder(saveFolder);
   
   var horizStyle = {};
   
     horizStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = "#D1D1D1"
     horizStyle[DocumentApp.Attribute.SPACING_BEFORE] = 0;
     horizStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
     horizStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
   
   var titleStyle = {};
   
     titleStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = "#C1D82F";     
     
   var headerStyle = {};
  
     headerStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
     headerStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
     headerStyle[DocumentApp.Attribute.MARGIN_BOTTOM] = 0;  
  
   var contentStyle = {};
  
     contentStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
     contentStyle[DocumentApp.Attribute.SPACING_BEFORE] = 0;
     contentStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
     contentStyle[DocumentApp.Attribute.MARGIN_TOP] = 1;
     contentStyle[DocumentApp.Attribute.MARGIN_BOTTOM] = 1;
     contentStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
     
   var tableStyle = {};
   
   tableStyle[DocumentApp.Attribute.BORDER_COLOR] = "#D1D1D1";
   tableStyle[DocumentApp.Attribute.PADDING_BOTTOM] = 0;
   tableStyle[DocumentApp.Attribute.PADDING_TOP] = 0;
   
   var headerCellStyle = {};
  
   headerCellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = "#C1D82F";
   headerCellStyle[DocumentApp.Attribute.BOLD] = true;
   headerCellStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
   headerCellStyle[DocumentApp.Attribute.WIDTH] = 82;
   headerCellStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
   headerCellStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
   
   var contentCellStyle = {};
   
   contentCellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = "#00B6DE";
   contentCellStyle[DocumentApp.Attribute.VERTICAL_ALIGNMENT] = DocumentApp.VerticalAlignment.CENTER;
   contentCellStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
   contentCellStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
   
   Logger.log(docUrl);
   
   var body = doc.getBody();
   
   body.setMarginTop(36);
   body.setMarginBottom(24);
   //body.insertImage(0, logoFile);
   var title = recordObjects[recordRow].title;
   
   var titlePara = body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.TITLE);
   titlePara.setAttributes(titleStyle);
   body.appendHorizontalRule().setAttributes(horizStyle);
   body.appendParagraph("");
   
   var detailCells = [
               [headerArray[1], recordObjects[recordRow][headerKeyArray[1]]],
               [headerArray[2], recordObjects[recordRow][headerKeyArray[2]]],
               [headerArray[3], recordObjects[recordRow][headerKeyArray[3]]],
               [headerArray[4], recordObjects[recordRow][headerKeyArray[4]]],
               [headerArray[5], recordObjects[recordRow][headerKeyArray[5]]],
               [headerArray[6], recordObjects[recordRow][headerKeyArray[6]]],
               [headerArray[7], recordObjects[recordRow][headerKeyArray[7]]],
               [headerArray[8], recordObjects[recordRow][headerKeyArray[8]]]
               ];
               
   var detailsTable = body.appendTable(detailCells);
   
   detailsTable.setAttributes(tableStyle);
   
   detailsTable.getCell(0, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(1, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(2, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(3, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(4, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(5, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(6, 0).setAttributes(headerCellStyle);
   detailsTable.getCell(7, 0).setAttributes(headerCellStyle);
   
   detailsTable.getCell(0, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(1, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(2, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(3, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(4, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(5, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(6, 1).setAttributes(contentCellStyle);
   detailsTable.getCell(7, 1).setAttributes(contentCellStyle);
   
   body.appendParagraph("");
   
   for(var i = 9; i < 11; i++){
   
     var sectionHeader = body.appendParagraph(headerArray[i]).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAttributes(headerStyle);
     body.appendHorizontalRule().setAttributes(horizStyle);
     var headerText = sectionHeader.editAsText();
     var textToColor = headerText.findText(headerArray[i]);
      //Logger.log("KEY__: " + keys[i]);
      //Logger.log(textToColor.getStartOffset());
      //Logger.log(textToColor.getEndOffsetInclusive());
     headerText.setForegroundColor(textToColor.getStartOffset(), textToColor.getEndOffsetInclusive(), "#C1D82F");
     
        
     var sectionContent = body.appendParagraph(recordObjects[recordRow][headerKeyArray[i]]);
     sectionContent.setAttributes(contentStyle);
     body.appendParagraph("");
     
   
   };
   
   body.appendPageBreak();
   
   /*Logger.log("KEY__: " + keys[1]);
   Logger.log("VALUE__:" + recordObjects[0][keys[1]]);
   Logger.log(typeof recordObjects[0][keys[1]]);*/
   
   for(var i = 11; i < 13; i++){   
     var sectionHeader = body.appendParagraph(headerArray[i]).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAttributes(headerStyle);
     body.appendHorizontalRule().setAttributes(horizStyle);
     var headerText = sectionHeader.editAsText();
     var textToColor = headerText.findText(headerArray[i]);
      //Logger.log("KEY__: " + keys[i]);
      //Logger.log(textToColor.getStartOffset());
      //Logger.log(textToColor.getEndOffsetInclusive());
     headerText.setForegroundColor(textToColor.getStartOffset(), textToColor.getEndOffsetInclusive(), "#C1D82F");     
        
     var sectionContent = body.appendParagraph(recordObjects[recordRow][headerKeyArray[i]]);
     sectionContent.setAttributes(contentStyle);
     body.appendParagraph("");  
   };
   
   body.appendPageBreak();
   
   for(var i = 13; i < 14; i++){   
     var sectionHeader = body.appendParagraph(headerArray[i]).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAttributes(headerStyle);
     body.appendHorizontalRule().setAttributes(horizStyle);
     var headerText = sectionHeader.editAsText();
     var textToColor = headerText.findText(headerArray[i]);
      //Logger.log("KEY__: " + keys[i]);
      //Logger.log(textToColor.getStartOffset());
      //Logger.log(textToColor.getEndOffsetInclusive());
     headerText.setForegroundColor(textToColor.getStartOffset(), textToColor.getEndOffsetInclusive(), "#C1D82F");     
        
     var sectionContent = body.appendParagraph(recordObjects[recordRow][headerKeyArray[i]]);
     sectionContent.setAttributes(contentStyle);
     body.appendParagraph("");  
   };
    
   var learningSkills = "";
   var personalSkills = "";
   var thinkingSkills = "";
   var techSkills = "";
   
   for(var i = 0; i < 7; i++){     
     if(recordObjects[recordRow][skillsKeyArray[i]] == true){
       learningSkills = learningSkills + skillsArray[i] + "\n";
     }   
   }
   
   for(var i = 7; i < 14; i++){     
     if(recordObjects[recordRow][skillsKeyArray[i]] == true){
       personalSkills = personalSkills + skillsArray[i] + "\n";
     }   
   }
   
   for(var i = 14; i < 17; i++){     
     if(recordObjects[recordRow][skillsKeyArray[i]] == true){
       thinkingSkills = thinkingSkills + skillsArray[i] + "\n";
     }   
   }
   
   for(var i = 17; i < 20; i++){     
     if(recordObjects[0][skillsKeyArray[i]] == true){
       techSkills = techSkills + skillsArray[i] + "\n";
     }   
   }   
   
   var patsCells = [
                   ["Learning skills", learningSkills],
                   ["Personal skills", personalSkills],
                   ["Thinking skills", thinkingSkills],
                   ["Technical skills", techSkills]
                   ];
   
   
   var patsTitle = body.appendParagraph("Personal and transferable skills").setHeading(DocumentApp.ParagraphHeading.HEADING1).setAttributes(headerStyle);
   var patsTitleText = patsTitle.editAsText();
   
   textToColor = patsTitleText.findText("Personal and transferable skills");
     patsTitleText.setForegroundColor(textToColor.getStartOffset(), textToColor.getEndOffsetInclusive(), "#C1D82F");
     
   body.appendHorizontalRule().setAttributes(horizStyle);
   
   var patsTable = body.appendTable(patsCells).setAttributes(tableStyle);
   
   patsTable.getCell(0, 0).setAttributes(headerCellStyle);
   patsTable.getCell(1, 0).setAttributes(headerCellStyle);
   patsTable.getCell(2, 0).setAttributes(headerCellStyle);
   patsTable.getCell(3, 0).setAttributes(headerCellStyle);
   
   patsTable.getCell(0, 1).setAttributes(contentCellStyle);
   patsTable.getCell(1, 1).setAttributes(contentCellStyle);
   patsTable.getCell(2, 1).setAttributes(contentCellStyle);
   patsTable.getCell(3, 1).setAttributes(contentCellStyle);
   
   //body.appendPageBreak();
   
   for(var i = 14; i < 22; i++){   
      var sectionHeader = body.appendParagraph(headerArray[i]).setHeading(DocumentApp.ParagraphHeading.HEADING1).setAttributes(headerStyle);
     body.appendHorizontalRule().setAttributes(horizStyle);
     var headerText = sectionHeader.editAsText();
     var textToColor = headerText.findText(headerArray[i]);
      //Logger.log("KEY__: " + keys[i]);
      //Logger.log(textToColor.getStartOffset());
      //Logger.log(textToColor.getEndOffsetInclusive());
     headerText.setForegroundColor(textToColor.getStartOffset(), textToColor.getEndOffsetInclusive(), "#C1D82F");     
        
     var sectionContent = body.appendParagraph(recordObjects[recordRow][headerKeyArray[i]]);
     sectionContent.setAttributes(contentStyle);
     body.appendParagraph("");  
   }
  

  Logger.log(recordId);
  Logger.log(recordRow);
  Logger.log(subjectSheet.getLastColumn());
  subjectSheet.getRange(recordRow + 2, 50, 1, 1).setValue(docUrl);
  subjectSheet.getRange(recordRow + 2, 9, 1, 1).setValue("Published");
  libSheet.getRange(libRecordRow + 2, 38, 1, 1).setValue(docUrl);
  libSheet.getRange(libRecordRow + 2, 9, 1, 1).setValue("Published"); 
  
  var publishedLink = app.createAnchor("Publishing of '" + title + "' completed. Click this message to open.", docUrl);
  publishSave.setWidget(0, 0, publishedLink);
  return app;

}

// HELPERS //////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

//getRowsData iterates row by row in the input range and returns an array of objects.
// Each object contains all the data for a given row, indexed by its normalized column name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getRowsData(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(range.getValues(), normalizeHeaders(headers));
}


//getHeaderLabels returns an array of strings from with the first row.
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - columnHeadersRowIndex: specifies the row number where the column names are stored.
//       This argument is optional and it defaults to the row immediately above range; 
// Returns an Array of objects.
function getHeaderLabels(sheet, range, columnHeadersRowIndex) {
  columnHeadersRowIndex = columnHeadersRowIndex || range.getRowIndex() - 1;
  var numColumns = range.getEndColumn() - range.getColumn() + 1;
  var headersRange = sheet.getRange(columnHeadersRowIndex, range.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return headers;
}

//getColumnsData iterates column by column in the input range and returns an array of objects.
// Each object contains all the data for a given column, indexed by its normalized row name.
// Arguments:
//   - sheet: the sheet object that contains the data to be processed
//   - range: the exact range of cells where the data is stored
//   - rowHeadersColumnIndex: specifies the column number where the row names are stored.
//       This argument is optional and it defaults to the column immediately left of the range; 
// Returns an Array of objects.
function getColumnsData(sheet, range, rowHeadersColumnIndex) {
  rowHeadersColumnIndex = rowHeadersColumnIndex || range.getColumnIndex() - 1;
  var headersTmp = sheet.getRange(range.getRow(), rowHeadersColumnIndex, range.getNumRows(), 1).getValues();
  var headers = normalizeHeaders(arrayTranspose(headersTmp)[0]);
  return getObjects(arrayTranspose(range.getValues()), headers);
}


//For every row of data in data, generates an object that contains the data. Names of
// object fields are defined in keys.
// Arguments:
//   - data: JavaScript 2d array
//   - keys: Array of Strings that define the property names for the objects to create
function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}

//Returns an Array of normalized Strings.
// Arguments:
//   - headers: Array of Strings to normalize
function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    var key = normalizeHeader(headers[i]);
    if (key.length > 0) {
      keys.push(key);
    }
  }
  return keys;
}

//Normalizes a string, by removing all alphanumeric characters and using mixed case
// to separate words. The output will always start with a lower case letter.
// This function is designed to produce JavaScript object property names.
// Arguments:
//   - header: string to normalize
// Examples:
//   "First Name" -> "firstName"
//   "Market Cap (millions) -> "marketCapMillions
//   "1 number at the beginning is ignored" -> "numberAtTheBeginningIsIgnored"
function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

//Returns true if the cell where cellData was read from is empty.
// Arguments:
//   - cellData: string
function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}

//Returns true if the character char is alphabetical, false otherwise.
function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}

//Returns true if the character char is a digit, false otherwise.
function isDigit(char) {
  return char >= '0' && char <= '9';
}

//Given a JavaScript 2d Array, this function returns the transposed table.
// Arguments:
//   - data: JavaScript 2d Array
// Returns a JavaScript 2d Array
// Example: arrayTranspose([[1,2,3],[4,5,6]]) returns [[1,4],[2,5],[3,6]].
function arrayTranspose(data) {
  if (data.length == 0 || data[0].length == 0) {
    return null;
  }

  var ret = [];
  for (var i = 0; i < data[0].length; ++i) {
    ret.push([]);
  }

  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      ret[j][i] = data[i][j];
    }
  }

  return ret;
}

//return date as string in DDD dd-mm-yyyy format
function shortDate(date){
  var d = new Date(date);
  var dayArray = ['Sun', 'Mon','Tue','Wed','Thu','Fri','Sat'];
  var curr_day = d.getDay();
  var curr_date = d.getDate();
    if(curr_date < 10){curr_date = "0" + curr_date;}
  var curr_month = d.getMonth() + 1;
    if(curr_month < 10){curr_month = "0" + curr_month;}
  var curr_year = d.getFullYear();  
  var shortDate = curr_date + "-" + curr_month + "-" + curr_year;
  //dayArray[curr_day] + " " + 
  return (shortDate);
}

function pad(n){
  var pad = "";  
  if(n < 10){pad = "0" + n}else{pad = n};  
  return pad;
}
