Attribute VB_Name = "Mod_DynamicSmartSearch"
Option Explicit

'=============================================================
' SMART SEARCH - TẠO USERFORM ĐỘNG + TRA CỨU + SHEET TRA_CUU
'
' Cách dùng:
'   1) Lưu file dưới dạng .xlsm
'   2) Excel > File > Options > Trust Center > Trust Center Settings
'      > Macro Settings > bật:
'      "Trust access to the VBA project object model"
'   3) Alt + F11 > Insert > Module
'   4) Dán/import toàn bộ module này
'   5) Chạy macro: CreateSmartSearchUserForm
'
' Sau khi tạo xong:
'   - Ctrl + Shift + F: mở form
'   - Enter trong ô từ khóa: tìm kiếm
'   - Double-click kết quả: nhảy đến ô
'=============================================================

Private Const FORM_NAME As String = "frmSmartSearch"
Private Const RESULT_SHEET As String = "TRA_CUU"
Private Const MAX_RESULTS As Long = 5000

'=============================================================
' 1. TẠO USERFORM TỰ ĐỘNG
'=============================================================
Public Sub CreateSmartSearchUserForm()
    Dim wb As Workbook
    Dim vbProj As Object
    Dim vbComp As Object
    Dim frm As Object
    Dim ctl As Object
    Dim codeModule As Object

    Set wb = ThisWorkbook

    On Error GoTo TrustError
    Set vbProj = wb.VBProject
    On Error GoTo EH

    Application.ScreenUpdating = False

    'Xóa form cũ nếu đã tồn tại
    On Error Resume Next
    Set vbComp = vbProj.VBComponents(FORM_NAME)
    On Error GoTo EH

    If Not vbComp Is Nothing Then
        vbProj.VBComponents.Remove vbComp
        Set vbComp = Nothing
    End If

    '3 = vbext_ct_MSForm
    Set vbComp = vbProj.VBComponents.Add(3)
    vbComp.Name = FORM_NAME

    Set frm = vbComp.Designer

    With frm
        .Caption = "SMART SEARCH PRO - TRA CỨU DỮ LIỆU"
        .Width = 790
        .Height = 530
        .BackColor = RGB(245, 248, 252)
        .StartUpPosition = 1
    End With

    '-------------------------------
    ' Tiêu đề
    '-------------------------------
    Set ctl = AddControl(frm, "Forms.Label.1", "lblTitle", 18, 12, 740, 30)
    With ctl
        .Caption = "SMART SEARCH PRO"
        .Font.Name = "Segoe UI"
        .Font.Size = 18
        .Font.Bold = True
        .ForeColor = RGB(31, 78, 121)
        .BackStyle = 0
    End With

    Set ctl = AddControl(frm, "Forms.Label.1", "lblSubTitle", 20, 43, 730, 18)
    With ctl
        .Caption = "Tìm kiếm nhanh dữ liệu trong Excel và đồng thời xuất kết quả sang sheet TRA_CUU"
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .ForeColor = RGB(95, 105, 120)
        .BackStyle = 0
    End With

    '-------------------------------
    ' Khung tìm kiếm
    '-------------------------------
    Set ctl = AddControl(frm, "Forms.Frame.1", "fraSearch", 18, 70, 740, 135)
    With ctl
        .Caption = "  Điều kiện tìm kiếm  "
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .Font.Bold = True
        .ForeColor = RGB(31, 78, 121)
        .BackColor = RGB(255, 255, 255)
    End With

    Set ctl = AddControl(frm, "Forms.Label.1", "lblKeyword", 35, 93, 80, 20)
    StyleLabel ctl, "Từ khóa:"

    Set ctl = AddControl(frm, "Forms.TextBox.1", "txtKeyword", 115, 89, 420, 25)
    With ctl
        .Font.Name = "Segoe UI"
        .Font.Size = 11
        .SpecialEffect = 0
        .BorderStyle = 1
    End With

    Set ctl = AddControl(frm, "Forms.CommandButton.1", "cmdSearch", 550, 87, 90, 29)
    StyleButton ctl, "TÌM KIẾM", RGB(0, 120, 215), RGB(255, 255, 255)
    ctl.Default = True

    Set ctl = AddControl(frm, "Forms.CommandButton.1", "cmdClear", 646, 87, 90, 29)
    StyleButton ctl, "XÓA", RGB(224, 230, 238), RGB(55, 65, 80)

    Set ctl = AddControl(frm, "Forms.Label.1", "lblScope", 35, 128, 80, 18)
    StyleLabel ctl, "Phạm vi:"

    Set ctl = AddControl(frm, "Forms.ComboBox.1", "cboScope", 115, 125, 190, 23)
    With ctl
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .Style = 2
    End With

    Set ctl = AddControl(frm, "Forms.Label.1", "lblLookIn", 325, 128, 70, 18)
    StyleLabel ctl, "Tìm trong:"

    Set ctl = AddControl(frm, "Forms.ComboBox.1", "cboLookIn", 395, 125, 140, 23)
    With ctl
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .Style = 2
    End With

    Set ctl = AddControl(frm, "Forms.CheckBox.1", "chkExact", 115, 160, 145, 19)
    StyleCheck ctl, "Khớp chính xác"

    Set ctl = AddControl(frm, "Forms.CheckBox.1", "chkMatchCase", 275, 160, 160, 19)
    StyleCheck ctl, "Phân biệt hoa/thường"

    Set ctl = AddControl(frm, "Forms.CheckBox.1", "chkHidden", 455, 160, 150, 19)
    StyleCheck ctl, "Tìm cả sheet ẩn"

    Set ctl = AddControl(frm, "Forms.CheckBox.1", "chkHighlight", 615, 160, 120, 19)
    StyleCheck ctl, "Highlight ô"
    ctl.Value = True

    '-------------------------------
    ' Tiêu đề kết quả
    '-------------------------------
    Set ctl = AddControl(frm, "Forms.Label.1", "lblResultTitle", 20, 216, 150, 22)
    With ctl
        .Caption = "KẾT QUẢ TRA CỨU"
        .Font.Name = "Segoe UI"
        .Font.Size = 10
        .Font.Bold = True
        .ForeColor = RGB(31, 78, 121)
        .BackStyle = 0
    End With

    Set ctl = AddControl(frm, "Forms.Label.1", "lblStatus", 175, 216, 580, 22)
    With ctl
        .Caption = "Sẵn sàng."
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .ForeColor = RGB(85, 95, 105)
        .TextAlign = 3
        .BackStyle = 0
    End With

    'Header cho ListBox
    AddHeaderLabel frm, "hdrSTT", "STT", 20, 242, 42
    AddHeaderLabel frm, "hdrSheet", "Tên Sheet", 62, 242, 135
    AddHeaderLabel frm, "hdrCell", "Ô", 197, 242, 75
    AddHeaderLabel frm, "hdrValue", "Giá trị tìm thấy", 272, 242, 465

    Set ctl = AddControl(frm, "Forms.ListBox.1", "lstResults", 20, 263, 717, 185)
    With ctl
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .ColumnCount = 4
        .ColumnWidths = "40 pt;130 pt;70 pt;430 pt"
        .IntegralHeight = False
        .MultiSelect = 0
    End With

    Set ctl = AddControl(frm, "Forms.Label.1", "lblHint", 20, 453, 500, 18)
    With ctl
        .Caption = "Mẹo: Nhấn Enter để tìm • Double-click một kết quả để nhảy tới ô."
        .Font.Name = "Segoe UI"
        .Font.Size = 8
        .ForeColor = RGB(105, 115, 125)
        .BackStyle = 0
    End With

    Set ctl = AddControl(frm, "Forms.CommandButton.1", "cmdOpenResultSheet", 520, 459, 115, 28)
    StyleButton ctl, "MỞ TRA_CUU", RGB(46, 117, 182), RGB(255, 255, 255)

    Set ctl = AddControl(frm, "Forms.CommandButton.1", "cmdClose", 643, 459, 94, 28)
    StyleButton ctl, "ĐÓNG", RGB(92, 102, 112), RGB(255, 255, 255)
    ctl.Cancel = True

    '-------------------------------
    ' Chèn code sự kiện cho UserForm
    '-------------------------------
    Set codeModule = vbComp.CodeModule
    codeModule.AddFromString GetFormEventCode()

    'Đảm bảo sheet TRA_CUU tồn tại
    EnsureResultSheet wb

    'Gán phím tắt
    Application.OnKey "^+F", "'" & ThisWorkbook.Name & "'!ShowSmartSearchForm"

    Application.ScreenUpdating = True

    MsgBox "Đã tạo UserForm '" & FORM_NAME & "' thành công!" & vbCrLf & vbCrLf & _
           "Mở bằng:" & vbCrLf & _
           "• Macro: ShowSmartSearchForm" & vbCrLf & _
           "• Phím tắt: Ctrl + Shift + F", _
           vbInformation, "Smart Search Pro"
    Exit Sub

TrustError:
    Application.ScreenUpdating = True
    MsgBox "Excel đang chặn VBA tự tạo UserForm." & vbCrLf & vbCrLf & _
           "Hãy bật:" & vbCrLf & _
           "File > Options > Trust Center > Trust Center Settings" & vbCrLf & _
           "> Macro Settings > Trust access to the VBA project object model" & vbCrLf & vbCrLf & _
           "Sau đó lưu file dạng .xlsm, mở lại Excel và chạy macro này.", _
           vbExclamation, "Cần cấp quyền VBA Project"
    Exit Sub

EH:
    Application.ScreenUpdating = True
    MsgBox "Không thể tạo UserForm." & vbCrLf & _
           "Lỗi " & Err.Number & ": " & Err.Description, _
           vbCritical, "Smart Search Pro"
End Sub

Private Function AddControl(ByVal frm As Object, ByVal progID As String, _
                            ByVal ctlName As String, ByVal leftPos As Single, _
                            ByVal topPos As Single, ByVal ctlWidth As Single, _
                            ByVal ctlHeight As Single) As Object
    Dim ctl As Object
    Set ctl = frm.Controls.Add(progID, ctlName, True)
    With ctl
        .Left = leftPos
        .Top = topPos
        .Width = ctlWidth
        .Height = ctlHeight
    End With
    Set AddControl = ctl
End Function

Private Sub StyleLabel(ByVal ctl As Object, ByVal text As String)
    With ctl
        .Caption = text
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .ForeColor = RGB(55, 65, 80)
        .BackStyle = 0
    End With
End Sub

Private Sub StyleCheck(ByVal ctl As Object, ByVal text As String)
    With ctl
        .Caption = text
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .ForeColor = RGB(55, 65, 80)
        .BackStyle = 0
    End With
End Sub

Private Sub StyleButton(ByVal ctl As Object, ByVal text As String, _
                        ByVal bgColor As Long, ByVal fgColor As Long)
    With ctl
        .Caption = text
        .Font.Name = "Segoe UI"
        .Font.Size = 9
        .Font.Bold = True
        .BackColor = bgColor
        .ForeColor = fgColor
        .SpecialEffect = 0
        .TakeFocusOnClick = False
    End With
End Sub

Private Sub AddHeaderLabel(ByVal frm As Object, ByVal ctlName As String, _
                           ByVal text As String, ByVal leftPos As Single, _
                           ByVal topPos As Single, ByVal ctlWidth As Single)
    Dim ctl As Object
    Set ctl = AddControl(frm, "Forms.Label.1", ctlName, leftPos, topPos, ctlWidth, 20)
    With ctl
        .Caption = text
        .Font.Name = "Segoe UI"
        .Font.Size = 8
        .Font.Bold = True
        .ForeColor = RGB(255, 255, 255)
        .BackColor = RGB(46, 117, 182)
        .TextAlign = 2
        .BorderStyle = 1
    End With
End Sub

'=============================================================
' 2. CODE ĐƯỢC TỰ ĐỘNG CHÈN VÀO USERFORM
'=============================================================
Private Function GetFormEventCode() As String
    Dim s As String

    s = ""
    s = s & "Option Explicit" & vbCrLf & vbCrLf

    s = s & "Private Sub UserForm_Initialize()" & vbCrLf
    s = s & "    Me.cboScope.Clear" & vbCrLf
    s = s & "    Me.cboScope.AddItem ""Toàn bộ Workbook""" & vbCrLf
    s = s & "    Me.cboScope.AddItem ""Sheet hiện tại""" & vbCrLf
    s = s & "    Me.cboScope.ListIndex = 0" & vbCrLf
    s = s & "    Me.cboLookIn.Clear" & vbCrLf
    s = s & "    Me.cboLookIn.AddItem ""Giá trị""" & vbCrLf
    s = s & "    Me.cboLookIn.AddItem ""Công thức""" & vbCrLf
    s = s & "    Me.cboLookIn.ListIndex = 0" & vbCrLf
    s = s & "    Me.lblStatus.Caption = ""Sẵn sàng.""" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub cmdSearch_Click()" & vbCrLf
    s = s & "    RunSmartSearchFromForm Me" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub cmdClear_Click()" & vbCrLf
    s = s & "    Me.txtKeyword.Value = """"" & vbCrLf
    s = s & "    Me.lstResults.Clear" & vbCrLf
    s = s & "    Me.lblStatus.Caption = ""Đã xóa kết quả trên form.""" & vbCrLf
    s = s & "    Me.txtKeyword.SetFocus" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub cmdClose_Click()" & vbCrLf
    s = s & "    Unload Me" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub cmdOpenResultSheet_Click()" & vbCrLf
    s = s & "    OpenTraCuuSheet" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub lstResults_DblClick(ByVal Cancel As MSForms.ReturnBoolean)" & vbCrLf
    s = s & "    Dim i As Long" & vbCrLf
    s = s & "    i = Me.lstResults.ListIndex" & vbCrLf
    s = s & "    If i < 0 Then Exit Sub" & vbCrLf
    s = s & "    SmartSearchJump CStr(Me.lstResults.List(i, 1)), CStr(Me.lstResults.List(i, 2))" & vbCrLf
    s = s & "End Sub" & vbCrLf & vbCrLf

    s = s & "Private Sub txtKeyword_KeyDown(ByVal KeyCode As MSForms.ReturnInteger, ByVal Shift As Integer)" & vbCrLf
    s = s & "    If KeyCode = 13 Then" & vbCrLf
    s = s & "        KeyCode = 0" & vbCrLf
    s = s & "        cmdSearch_Click" & vbCrLf
    s = s & "    End If" & vbCrLf
    s = s & "End Sub" & vbCrLf

    GetFormEventCode = s
End Function

'=============================================================
' 3. MỞ FORM
'=============================================================
Public Sub ShowSmartSearchForm()
    Dim frm As Object

    On Error GoTo NoForm
    Set frm = VBA.UserForms.Add(FORM_NAME)
    frm.Show
    Exit Sub

NoForm:
    MsgBox "Chưa có UserForm '" & FORM_NAME & "'." & vbCrLf & _
           "Hãy chạy macro CreateSmartSearchUserForm trước.", _
           vbExclamation, "Smart Search Pro"
End Sub

'=============================================================
' 4. TÌM KIẾM TỪ USERFORM
'=============================================================
Public Sub RunSmartSearchFromForm(ByVal frm As Object)
    Dim wb As Workbook
    Dim ws As Worksheet
    Dim currentWs As Worksheet
    Dim resultWs As Worksheet

    Dim keyword As String
    Dim lookInType As Long
    Dim lookAtType As Long
    Dim searchAll As Boolean
    Dim includeHidden As Boolean
    Dim matchCase As Boolean
    Dim doHighlight As Boolean

    Dim resultRow As Long
    Dim totalFound As Long
    Dim startTime As Double

    Set wb = ActiveWorkbook
    If wb Is Nothing Then Exit Sub

    keyword = Trim$(CStr(frm.Controls("txtKeyword").Value))

    If Len(keyword) = 0 Then
        MsgBox "Vui lòng nhập từ khóa cần tìm.", vbExclamation, "Smart Search Pro"
        frm.Controls("txtKeyword").SetFocus
        Exit Sub
    End If

    searchAll = (frm.Controls("cboScope").ListIndex = 0)

    If frm.Controls("cboLookIn").ListIndex = 1 Then
        lookInType = xlFormulas
    Else
        lookInType = xlValues
    End If

    If frm.Controls("chkExact").Value = True Then
        lookAtType = xlWhole
    Else
        lookAtType = xlPart
    End If

    matchCase = CBool(frm.Controls("chkMatchCase").Value)
    includeHidden = CBool(frm.Controls("chkHidden").Value)
    doHighlight = CBool(frm.Controls("chkHighlight").Value)

    startTime = Timer

    On Error GoTo EH

    Application.ScreenUpdating = False
    Application.EnableEvents = False
    Application.StatusBar = "Smart Search đang tìm kiếm..."

    frm.Controls("cmdSearch").Enabled = False
    frm.Controls("lblStatus").Caption = "Đang tìm kiếm..."
    frm.Controls("lstResults").Clear
    DoEvents

    Set resultWs = EnsureResultSheet(wb)
    PrepareResultSheet resultWs, keyword

    resultRow = 3
    totalFound = 0

    If searchAll Then
        For Each ws In wb.Worksheets
            If UCase$(ws.Name) <> UCase$(RESULT_SHEET) Then
                If ws.Visible = xlSheetVisible Or includeHidden Then
                    SearchOneSheet ws, resultWs, frm, keyword, lookInType, lookAtType, _
                                   matchCase, doHighlight, resultRow, totalFound
                    If totalFound >= MAX_RESULTS Then Exit For
                End If
            End If
        Next ws
    Else
        Set currentWs = wb.ActiveSheet

        If UCase$(currentWs.Name) = UCase$(RESULT_SHEET) Then
            MsgBox "Bạn đang đứng ở sheet TRA_CUU." & vbCrLf & _
                   "Hãy chọn sheet dữ liệu khác hoặc chọn phạm vi Toàn bộ Workbook.", _
                   vbExclamation, "Smart Search Pro"
            GoTo SafeExit
        End If

        SearchOneSheet currentWs, resultWs, frm, keyword, lookInType, lookAtType, _
                       matchCase, doHighlight, resultRow, totalFound
    End If

    FinalizeResultSheet resultWs, resultRow, totalFound

    If totalFound = 0 Then
        frm.Controls("lblStatus").Caption = "Không tìm thấy kết quả."
        MsgBox "Không tìm thấy dữ liệu phù hợp với từ khóa:" & vbCrLf & _
               """" & keyword & """", vbInformation, "Smart Search Pro"
    Else
        frm.Controls("lblStatus").Caption = "Tìm thấy " & Format$(totalFound, "#,##0") & _
                                             " kết quả • " & Format$(Timer - startTime, "0.00") & " giây"
    End If

    If totalFound >= MAX_RESULTS Then
        MsgBox "Đã đạt giới hạn " & Format$(MAX_RESULTS, "#,##0") & " kết quả." & vbCrLf & _
               "Hãy nhập từ khóa cụ thể hơn để thu hẹp phạm vi tìm kiếm.", _
               vbInformation, "Smart Search Pro"
    End If

SafeExit:
    frm.Controls("cmdSearch").Enabled = True
    Application.StatusBar = False
    Application.EnableEvents = True
    Application.ScreenUpdating = True
    Exit Sub

EH:
    MsgBox "Có lỗi khi tìm kiếm." & vbCrLf & _
           "Lỗi " & Err.Number & ": " & Err.Description, _
           vbCritical, "Smart Search Pro"
    Resume SafeExit
End Sub

Private Sub SearchOneSheet(ByVal ws As Worksheet, _
                           ByVal resultWs As Worksheet, _
                           ByVal frm As Object, _
                           ByVal keyword As String, _
                           ByVal lookInType As Long, _
                           ByVal lookAtType As Long, _
                           ByVal matchCase As Boolean, _
                           ByVal doHighlight As Boolean, _
                           ByRef resultRow As Long, _
                           ByRef totalFound As Long)

    Dim foundCell As Range
    Dim firstAddress As String
    Dim displayValue As String
    Dim rowIndex As Long

    On Error GoTo SafeExit

    Set foundCell = ws.Cells.Find(What:=keyword, _
                                  After:=ws.Cells(ws.Rows.Count, ws.Columns.Count), _
                                  LookIn:=lookInType, _
                                  LookAt:=lookAtType, _
                                  SearchOrder:=xlByRows, _
                                  SearchDirection:=xlNext, _
                                  MatchCase:=matchCase, _
                                  SearchFormat:=False)

    If foundCell Is Nothing Then Exit Sub

    firstAddress = foundCell.Address

    Do
        totalFound = totalFound + 1

        If lookInType = xlFormulas Then
            displayValue = CStr(foundCell.Formula)
        Else
            On Error Resume Next
            displayValue = CStr(foundCell.Value2)
            On Error GoTo SafeExit
        End If

        displayValue = Replace(displayValue, vbCr, " ")
        displayValue = Replace(displayValue, vbLf, " ")
        If Len(displayValue) > 250 Then displayValue = Left$(displayValue, 247) & "..."

        'Ghi vào sheet TRA_CUU
        resultWs.Cells(resultRow, 1).Value = totalFound
        resultWs.Cells(resultRow, 2).Value = ws.Name
        resultWs.Cells(resultRow, 3).Value = foundCell.Address(False, False)
        resultWs.Cells(resultRow, 4).Value = displayValue

        resultWs.Hyperlinks.Add _
            Anchor:=resultWs.Cells(resultRow, 5), _
            Address:="", _
            SubAddress:="'" & Replace(ws.Name, "'", "''") & "'!" & foundCell.Address, _
            TextToDisplay:="Đến ô"

        'Ghi lên ListBox
        frm.Controls("lstResults").AddItem CStr(totalFound)
        rowIndex = frm.Controls("lstResults").ListCount - 1
        frm.Controls("lstResults").List(rowIndex, 1) = ws.Name
        frm.Controls("lstResults").List(rowIndex, 2) = foundCell.Address(False, False)
        frm.Controls("lstResults").List(rowIndex, 3) = displayValue

        If doHighlight Then
            foundCell.Interior.Color = RGB(255, 242, 153)
        End If

        resultRow = resultRow + 1

        If totalFound >= MAX_RESULTS Then Exit Do

        Set foundCell = ws.Cells.FindNext(After:=foundCell)
        If foundCell Is Nothing Then Exit Do

    Loop While foundCell.Address <> firstAddress

SafeExit:
End Sub

'=============================================================
' 5. SHEET TRA_CUU
'=============================================================
Public Function EnsureResultSheet(ByVal wb As Workbook) As Worksheet
    Dim ws As Worksheet

    On Error Resume Next
    Set ws = wb.Worksheets(RESULT_SHEET)
    On Error GoTo 0

    If ws Is Nothing Then
        Set ws = wb.Worksheets.Add(After:=wb.Worksheets(wb.Worksheets.Count))
        ws.Name = RESULT_SHEET
        ws.Tab.Color = RGB(0, 112, 192)
    End If

    Set EnsureResultSheet = ws
End Function

Private Sub PrepareResultSheet(ByVal ws As Worksheet, ByVal keyword As String)
    With ws
        .Cells.Clear

        .Range("A1:E1").Merge
        .Range("A1").Value = "KẾT QUẢ TRA CỨU: """ & UCase$(keyword) & """"
        .Range("A1").Font.Name = "Segoe UI"
        .Range("A1").Font.Size = 14
        .Range("A1").Font.Bold = True
        .Range("A1").Font.Color = RGB(255, 255, 255)
        .Range("A1").Interior.Color = RGB(31, 78, 121)
        .Range("A1").HorizontalAlignment = xlLeft
        .Range("A1").VerticalAlignment = xlCenter
        .Rows(1).RowHeight = 30

        .Range("A2").Value = "STT"
        .Range("B2").Value = "Tên Sheet"
        .Range("C2").Value = "Ô"
        .Range("D2").Value = "Giá trị tìm thấy"
        .Range("E2").Value = "Hành động"

        With .Range("A2:E2")
            .Font.Name = "Segoe UI"
            .Font.Size = 10
            .Font.Bold = True
            .Font.Color = RGB(255, 255, 255)
            .Interior.Color = RGB(46, 117, 182)
            .HorizontalAlignment = xlCenter
            .VerticalAlignment = xlCenter
        End With

        .Rows(2).RowHeight = 24
    End With
End Sub

Private Sub FinalizeResultSheet(ByVal ws As Worksheet, _
                                ByVal resultRow As Long, _
                                ByVal totalFound As Long)
    If totalFound <= 0 Then
        ws.Range("A3").Value = "Không tìm thấy dữ liệu phù hợp."
        Exit Sub
    End If

    With ws.Range("A2:E" & resultRow - 1)
        .Borders.LineStyle = xlContinuous
        .Borders.Color = RGB(215, 220, 225)
        .VerticalAlignment = xlCenter
    End With

    ws.Columns("A").ColumnWidth = 8
    ws.Columns("B").ColumnWidth = 22
    ws.Columns("C").ColumnWidth = 12
    ws.Columns("D").ColumnWidth = 55
    ws.Columns("E").ColumnWidth = 15

    ws.Columns("A").HorizontalAlignment = xlCenter
    ws.Columns("C").HorizontalAlignment = xlCenter
    ws.Columns("E").HorizontalAlignment = xlCenter

    ws.Range("A2:E" & resultRow - 1).AutoFilter

    ws.Activate
    ws.Range("A1").Select
End Sub

Public Sub OpenTraCuuSheet()
    Dim wb As Workbook
    Dim ws As Worksheet

    Set wb = ActiveWorkbook
    If wb Is Nothing Then Exit Sub

    Set ws = EnsureResultSheet(wb)
    ws.Visible = xlSheetVisible
    ws.Activate
    ws.Range("A1").Select
End Sub

'=============================================================
' 6. DOUBLE CLICK KẾT QUẢ -> NHẢY TỚI Ô
'=============================================================
Public Sub SmartSearchJump(ByVal sheetName As String, ByVal cellAddress As String)
    Dim wb As Workbook
    Dim ws As Worksheet

    Set wb = ActiveWorkbook
    If wb Is Nothing Then Exit Sub

    On Error GoTo EH
    Set ws = wb.Worksheets(sheetName)

    If ws.Visible <> xlSheetVisible Then ws.Visible = xlSheetVisible

    ws.Activate
    Application.Goto ws.Range(cellAddress), True
    Exit Sub

EH:
    MsgBox "Không thể mở vị trí:" & vbCrLf & _
           sheetName & "!" & cellAddress, vbExclamation, "Smart Search Pro"
End Sub

'=============================================================
' 7. PHÍM TẮT KHI MỞ WORKBOOK
'=============================================================
Public Sub Auto_Open()
    On Error Resume Next
    Application.OnKey "^+F", "'" & ThisWorkbook.Name & "'!ShowSmartSearchForm"
End Sub
