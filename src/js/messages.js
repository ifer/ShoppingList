import { appinfo } from "./appinfo";

var messages = {
    appname: "Λίστα Αγορών",
    users: "Χρήστες εφαρμογής",
    login: "Είσοδος στην εφαρμογή",
    username: "Όνομα χρήστη",
    password: "Password",
    signin: "Είσοδος στην εφαρμογή",
    logout: "Αποσύνδεση",
    submit: "Υποβολή",
    wrong_credentials: "Λάθος όνομα χρήστη ή κωδικός!",
    listEmpty: "Δεν υπάρχουν δεδομένα",
    action_add: "Προσθήκη",
    action_update: "Επεξεργασία",
    action_delete: "Διαγραφή",
    action_search: "Αναζήτηση",
    action_open: "Άνοιγμα",
    btnOK: "ΟΚ",
    btnSave: "Αποθήκευση",
    btnCancel: "Άκυρο",
    btnPrint: "Εκτύπωση",
    btnUndo: "Ακύρωση",
    btnClear: "Καθαρισμός",
    btnReturn: "Επιστροφή",
    yes: "ΝΑΙ",
    no: "ΟΧΙ",
    products: "Προϊόντα",
    staticdata: "Δεδομένα",
    usersTitle: "Χρήστες εφαρμογής",
    userdata: "Στοιχεία χρήστη",
    usersId: "α/α",
    usersName: "Όνομα",
    usersPassword: "Μυστικός κωδικός",
    usersPasswordRepeat: "Επανάληψη κωδικού",
    usersRoles: "Ρόλοι",
    deleteUserConfirmTitle: "Διαγραφή χρήστη",
    deleteUserConfirmBody1: "Πρόκειται να διαγραφεί ο χρήστης: ",
    deleteUserConfirmBody2: "Παρακαλώ επιβεβαιώστε.",
    passwordsNotFit: "Οι μυστικοί κωδικοί δεν ταιριάζουν",
    userActionNotPermitted: "Δεν έχετε δικαίωμα για την ενέργεια αυτή!",
    userCanOnlyChangeOwnPassword:
        "Μπορείτε να αλλάξετε μόνο τον δικό σας μυστικό κωδικό!",
    rolesHelp:
        "Ένας ή περισσότεροι ρόλοι χωρισμένοι με κόμμα.\n Έγκυροι ρόλοι: ROLE_USER, ROLE_ADMIN, ROLE_READONLY",
    api_uknown_error: "Πρόβλημα στην επικοινωνία με τον server!",
    notsavedWarning: "Τα δεδομένα έχουν μεταβληθεί αλλά δεν έχουν αποθηκευθεί.\nΕίστε βέβαιοι ότι θέλετε να φύγετε;",
    cancelTitle: "Ακύρωση ενέργειας",
    cancelWarning: "Είστε βέβαιοι ότι θέλετε να ακυρώστε τις αλλαγές;",
    deleteConfirmTitle: "Διαγραφή",
    deleteConfirmBody1: "Πρόκειται να διαγραφεί : ",
    deleteConfirmBody2: "Παρακαλώ επιβεβαιώστε.",
    dateformat_gr: "ΗΗ/ΜΜ/ΕΕΕΕ",
    usersTitle: "Χρήστες εφαρμογής",
    userdata: "Στοιχεία χρήστη",
    usersId: "α/α",
    usersName: "Όνομα",
    usersPassword: "Μυστικός κωδικός",
    usersPasswordRepeat: "Επανάληψη κωδικού",
    usersRoles: "Ρόλοι",
    deleteUserConfirmTitle: "Διαγραφή χρήστη",
    deleteUserConfirmBody1: "Πρόκειται να διαγραφεί ο χρήστης: ",
    deleteUserConfirmBody2: "Παρακαλώ επιβεβαιώστε.",
    passwordsNotFit: "Οι μυστικοί κωδικοί δεν ταιριάζουν",
    passwordNotStrong: "Ο μυστικός κωδικός δεν είναι αρκετά ισχυρός. Πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες, εκ των οποίων τουλάχιστον 1 αριθμό και τουλάχιστον 1 σύμβολο από τα εξής:  ! @ # $ % ^ & * ? _ ~ - , .",
    userActionNotPermitted: "Δεν έχετε δικαίωμα για την ενέργεια αυτή!",
    userCanOnlyChangeOwnPassword: "Μπορείτε να αλλάξετε μόνο τον δικό σας μυστικό κωδικό!",
    rolesHelp: "Ένας ή περισσότεροι ρόλοι χωρισμένοι με κόμμα.\n Έγκυροι ρόλοι: ROLE_USER, ROLE_ADMIN, ROLE_READONLY",


    daynames: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
    monthnames: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],

    signature: "Έκδ." + appinfo.version + "  © " + appinfo.signature
};
export { messages };