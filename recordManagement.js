///{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ GLOBALS }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}

  var subjectArray = ["", "Bahasa Malayu", "Biology", "Business", "Chemistry","Digital Literacy", "Drama and Theatre Arts",
                      "EAL", "Economics", "English", "ESS", "Film and Media", "French", "Geography", "Global Perspectives",
                      "Health and PE", "History", "Humanities", "Mandarin", "Mathematics", "Music", "Physics", "PSHE", "Psychology",
                      "Science", "Spanish", "Sports Science", "Visual Art"];
  
  var yearArray = ["", "Reception", "Nursery", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6", "Year 7", "Year 8", "Year 9",
                   "Year 10", "Year 11", "Year 12", "Year 13"];

  var termArray = ["", "1.1", "1.2", "2.1", "2.2", "3.1", "3.2"];
  
  var conceptualArray = ["", "Rhythm", "Harmony", "Form", "Colour", "Value", "Shape", "Space", "Proportion", "Symmetry", "Probability", "Pattern",
                         "Order", "System", "Organism", "Power", "Relationships", "Envy", "Emotions", "Oppression", "Influence", "Organisation",
                         "Population", "Evolution", "Cycle", "Interaction", "Energy", "Balance", "Change", "Continuity", "Culture", "Civilisation",
                         "Migration", "Interdependence", "Prejudice", "Perspective", "Conventions", "Fluency", "Symbolism", "Metaphor", "Complexity",
                         "Beliefs", "Paradox", "Freedom", "Identity", "Origins", "Revolution", "Structure", "Function", "Innovation", "Design", "Force",
                         "Creativity"];

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
  var printHandler = app.createServerHandler("openRecord");  
  
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
    var libRange = libSheet.getRange(2, 1, recordRange, 9);  
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
               .setWidget(0, 6, app.createLabel(""));
  
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
  
  for(var i = 0; i < userRecords.length; i++){
    
    flex.setText(i+1, 0, userRecords[i].documentId)
        .setText(i+1, 1, userRecords[i].title)
        .setText(i+1, 2, userRecords[i].subject)
        .setText(i+1, 3, shortDate(userRecords[i].dateCreated)).setStyleAttribute(i+1, 3, "text-align", "center")
        .setText(i+1, 4, userRecords[i].status.toString()).setStyleAttribute(i+1, 4, "text-align", "center")
        .setWidget(i+1, 5, app.createButton("edit").setId(editText + userRecords[i].documentId).addClickHandler(editHandler).setStyleAttributes(smallBtnStyle));        
        
        if(userRecords[i].status.toString() == "Published"){
          flex.setWidget(i+1, 6, app.createButton("open").setId(openText + userRecords[i].documentId).addClickHandler(printHandler).setStyleAttributes(smallBtnStyle))
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
  var saveBtnOne = app.createButton("<B>save</B>");
  var saveBtnTwo = app.createButton("<B>save</B>");
  var saveBtnThree = app.createButton("<B>save</B>");
  var saveBtnFour = app.createButton("<B>save</B>");
  var saveBtnFive = app.createButton("<B>save</B>");

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
                     .setWidget(1, 2, chk_02).setText(1, 3, "Take initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital applications in making moving image")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquire")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research skills")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Plan narratives & moving image production")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded / Internationally minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborate")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicate")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflect / review")
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
  
//HANDLERS
  var saveHandler = app.createServerClickHandler('save');
  saveHandler.addCallbackElement(flow);
  
  var saveLabelHandler = app.createClientHandler().forTargets(saveLabel1, saveLabel2, saveLabel3, saveLabel4, saveLabel5).setText("saving...");                            
  
//ADD HANDLERS
  saveBtnOne.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnTwo.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnThree.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnFour.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnFive.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  
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

//GET FORM OUTPUT
  var docId = e.parameter.docId_tag;
  var dateCreatedText = e.parameter.dateText.toString();
  var title = e.parameter.titleText;
  var subjectText = e.parameter.subjectText;
  var subjectIndex = subjectArray.indexOf(subjectText);  
  var department = "=VLOOKUP(R[0]C[-2],Publishers,3,FALSE)";
  var author = e.parameter.authorText_tag
  var publisher = "=VLOOKUP(R[0]C[-4],Publishers,2,FALSE)";
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
  
  var statusValues = [docId, dateCreatedText, title, subjectText, author, year, group, term, conceptLens, keyConcepts,
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
  var values = [docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20];
                
  var values2 = [[docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                  chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20]];
                  
  var valuesFull = [docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex,  group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length];
                    
  var valuesFull2 = [[docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText, length]];
  
//IF NEW APPEND TO SHEET AS NEW RECORD ROW
  if(isNew == true){
    libSheet.appendRow(values);
    subjectSheet.appendRow(valuesFull);    
    docIdLabel.setText(docId).setTag(docId);
    
    for(var i = 0; i < saveLabels.length; i++){    
        var label = app.getElementById(saveLabels[i]);
        label.setText("");
    }
    return app;
  }
  
//IF NOT NEW CONTINUE AND CREATE ARRAY OF EXISTING RECORDS
  var recordRange = libSheet.getLastRow()-1; 
  var libRange = libSheet.getRange(2, 1, recordRange, 37);
  var recordObjects = getRowsData(libSheet, libRange);
  var recordMatchRow = 0;
  var subjectMatchRow = 0;
 
//NEW UPDATE BLOCK
  for(var i = 0; i < recordObjects.length; i++){    
    if(recordObjects[i].documentId === docId && recordObjects[i].dateCreated === dateCreatedText && recordObjects[i].subject == subjectText){
      isUpdate = true;
      recordMatchRow = i+2;
    }
  }

  if(isUpdate == true){
    libSheet.getRange(recordMatchRow, 1, 1, 37).setValues(values2);
    
    var lastRow = subjectSheet.getLastRow();
    var subjectRecords = subjectSheet.getRange(1, 1, lastRow, 1).getValues();

    for(var i = 0; i < subjectRecords.length; i++){
      if(subjectRecords[i][0] == docId){
        subjectMatchRow = i+1;
        subjectSheet.getRange(subjectMatchRow, 1, 1, 49).setValues(valuesFull2);
      }  
    }
    
    for(var i = 0; i < saveLabels.length; i++){    
      var label = app.getElementById(saveLabels[i]);
      label.setText("");
    }
    return app;
  }

//IF NOT NEW AND NOT UPDATE CREATE NEW ID, COPY ALL OTHER DETAILS AND APPEND VALUES TO SPREADSHEET AS NEW RECORD
  docId = new Date().getTime().toString();
//SET VALUE ARRAYS AND OBJECTS AGAIN - YES, RIDICULOUS, apparently it calls docId value set earlier in the script, not the one reset above
  values = [docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20];
  valuesFull = [docId, dateCreatedText, title, subjectText, subjectIndex, department, author, publisher, status, year, yearIndex, group, term, termIndex, conceptLens, conceptualIndex, keyConcepts,
                    chk_01, chk_02, chk_03, chk_04, chk_05, chk_06, chk_07, chk_08, chk_09, chk_10, chk_11, chk_12, chk_13, chk_14, chk_15, chk_16, chk_17, chk_18, chk_19, chk_20,
                    unitText, relevantText, curricText, underText, debatableText, conceptualText, factualText, knowText, skillText, successText, assessText];
  libSheet.appendRow(values);
  subjectSheet.appendRow(valuesFull);
  
  docIdLabel.setText(docId).setTag(docId);
  
  for(var i = 0; i < saveLabels.length; i++){   
    var label = app.getElementById(saveLabels[i]);
    label.setText("");
  }  
  return app;
}

///{{{{{{{{{{{{{{{{{{{{{{{{{ SEARCH }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

function searchDisplay(){
  Logger.log("running search display function");
  var app = UiApp.getActiveApplication();
  var panel = app.getElementById("panel");
  panel.clear();
  
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
  
  var searchLabel = app.createLabel("Search the library").setStyleAttribute("fontSize", "20px").setStyleAttributes(headerStyle);
  var searchTitle = app.createGrid(1,2).setWidth("900px")
                       .setCellPadding(10)
                       .setStyleAttributes({background: titleColor, width: "900px"})
                       .setWidget(0, 0, searchLabel)
                       .setWidget(0, 1, app.createButton("<B>search</B>").setStyleAttributes(largeBtnStyle))
                       .setStyleAttribute(0, 1, "text-align", "right");
                        
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

  var keyText = app.createTextArea().setWidth("700px").setVisibleLines(1).setStyleAttribute("maxWidth", "700px").setName("keyText")
                   .setTitle("A concept is a big idea represented by one or two words. It is timeless, universal and abstract \
e.g. patterns.");
                       
  var searchGrid = app.createGrid(6, 2)
                         .setBorderWidth(0)
                         .setCellSpacing(0)
                         .setCellPadding(10) 
                         .setStyleAttributes({background: light})
                         .setStyleAttribute(0, 0, "width", "200px")
                         .setText(0, 0, "Unit title").setWidget(0, 1, titleText)  
                         .setText(1, 0, "Subject").setWidget(1, 1, subjectList)           
                         .setText(2, 0, "Age range").setWidget(2, 1, ageRangeText)           
                         .setText(3, 0, "Term").setWidget(3, 1, termText)
                         .setText(4, 0, "Conceptual lens").setWidget(4, 1, conceptText)
                         .setText(5, 0, "Key concepts").setWidget(5, 1, keyText);                        
                        
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
                     .setWidget(1, 2, chk_02).setText(1, 3, "Take initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital applications in making moving image")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquire")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research skills")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Plan narratives & moving image production")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded / Internationally minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborate")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicate")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflect / review")
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
           
  
  var searchEndTitle = app.createGrid(1,2).setWidth("900px")
                          .setCellPadding(10)
                          .setStyleAttributes({background: titleColor, width: "900px"})
                          .setWidget(0, 1, app.createButton("<B>search</B>").setStyleAttributes(largeBtnStyle))
                          .setStyleAttribute(0, 1, "text-align", "right");
  
  panel.add(searchTitle);
  panel.add(searchGrid);     
  panel.add(goalsGridBottom);
  panel.add(searchEndTitle);
  return app

}

///{{{{{{{{{{{{{{{{{{{{{{{{{ EDIT RECORD }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function editRecord(e) { 
  
  Logger.log("edit record function running");
  //GET RECORD ID AND INITIALISE SUBJECT VAR
  var source = e.parameter.source;
  var recordId = source.substr(8);
  var taskId = source.substr(0, 3);
  //Logger.log(taskId);
  var isPublisher = false;
  
  var subjectSheetName = "";
  var missingLibraryRecord = true;
  var missingSubjectRecord = true;
  
  //SHEET
  var ss = SpreadsheetApp.openById("0AvxDSSvcJgoIdDM1ZGhhQVZVcG52M0k3clNNWnJJUXc");
  var libSheet = ss.getSheetByName("Library");
  var libRange = libSheet.getRange(2, 1, libSheet.getLastRow() - 1, 4);
  
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
  
  //function to get size of array by counting keys with corresponding values only   
  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  // Get the size of an object
  var size = Object.size(subjectRecordObjects[0]);  
  
  for(var i = 0; i < subjectRecordObjects.length; i++){
    if(subjectRecordObjects[i].documentId == recordId){    
      recordRow = i;
      missingSubjectRecord = false;
      break;   
    }  
  }
  
  Logger.log(subjectRecordObjects[0]);
  
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
  var saveBtnOne = app.createButton("<B>save</B>");
  var saveBtnTwo = app.createButton("<B>save</B>");
  var saveBtnThree = app.createButton("<B>save</B>");
  var saveBtnFour = app.createButton("<B>save</B>");
  var saveBtnFive = app.createButton("<B>save</B>");

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
                     .setWidget(1, 2, chk_02).setText(1, 3, "Take initiative")
                     .setWidget(1, 4, chk_03).setText(1, 5, "Knowledgeable")
                     .setWidget(5, 0, chk_04).setText(5, 1, "Critical (analysis and evaluation)")
                     .setWidget(2, 0, chk_05).setText(2, 1, "Digital applications in making moving image")
                     .setWidget(2, 2, chk_06).setText(2, 3, "Enquire")
                     .setWidget(2, 4, chk_07).setText(2, 5, "Principled")
                     .setWidget(6, 0, chk_08).setText(6, 1, "Metacognition")
                     .setWidget(3, 0, chk_09).setText(3, 1, "Research skills")
                     .setWidget(3, 2, chk_10).setText(3, 3, "Plan narratives & moving image production")
                     .setWidget(3, 4, chk_11).setText(3, 5, "Open minded / Internationally minded")
                     .setWidget(7, 0, chk_12).setText(7, 1, "Problem solving")
                     .setWidget(4, 2, chk_13).setText(4, 3, "Collaborate")
                     .setWidget(4, 4, chk_14).setText(4, 5, "Caring")
                     .setWidget(5, 2, chk_15).setText(5, 3, "Synthesise (design / create / make)")
                     .setWidget(5, 4, chk_16).setText(5, 5, "Courageous")
                     .setWidget(6, 2, chk_17).setText(6, 3, "Communicate")
                     .setWidget(6, 4, chk_18).setText(6, 5, "Balanced")
                     .setWidget(7, 2, chk_19).setText(7, 3, "Reflect / review")
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
  
//HANDLERS
  var saveHandler = app.createServerClickHandler('save');
  saveHandler.addCallbackElement(flow);
  
  var saveLabelHandler = app.createClientHandler().forTargets(saveLabel1, saveLabel2, saveLabel3, saveLabel4, saveLabel5).setText("saving...");                            
  
//ADD HANDLERS
  saveBtnOne.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnTwo.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnThree.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnFour.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  saveBtnFive.addClickHandler(saveHandler).addClickHandler(saveLabelHandler);
  
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

///{{{{{{{{{{{{{{{{{{{{{{{{{ OPEN }}}}}}}}}}}}}}}}}}}}}}}}}]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
function openRecord(e){
  Logger.log("running open function");
  var source = e.parameter.source;
  var recordId = source.subStr(5);
  
  Logger.log(recordId);

}
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
  var dayArray = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var curr_day = d.getDay() - 1;
  var curr_date = d.getDate();
    if(curr_date < 10){curr_date = "0" + curr_date;}
  var curr_month = d.getMonth() + 1;
    if(curr_month < 10){curr_month = "0" + curr_month;}
  var curr_year = d.getFullYear();  
  var shortDate = dayArray[curr_day] + " " + curr_date + "-" + curr_month + "-" + curr_year;  
  return (shortDate);
}