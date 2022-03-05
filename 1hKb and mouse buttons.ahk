#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#InstallKeybdHook  ; There was a obscure reason for this but forgot what exactly.
; #Warn  ; Enable warnings to assist with detecting common errors.
;SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
SetCapsLockState, alwaysoff
#SingleInstance force
;==========================================================================
;  Main purpose of this script is to handle all mouse clicks through a keyboard(that has a nordic layout).
;  Also makes getting some symbols easier to do with just 1 hand on left side of keyboard.
;  Mainly uses "><|" key(SC056) next to shift or CapsLock combined with another key to do stuff.
;  Originally made due to my mouse starting to do double clicks on it's own.
;==========================================================================

;==========================================================================
;oh shit buttons in case the script does something terrible
;assumes ctrl/shift/alt+pause does nothing important
;==========================================================================

^Pause::ExitApp
+Pause::suspend
!Pause::pause

;SC056 & SC029::suspend
;SC056 & 1::pause


;==========================================================================
;mouse keys
;==========================================================================

LWin::LButton
AppsKey::Lbutton

SC056 & LWin::send {sc056 up}{Lcontrol up}{RButton}
SC056 & lalt::send {MButton}

;  modifier keys(other than lalt for some reason) don't like being the 2nd key of a hotkey ie. "SC056 & control::XButton2" is invalid
;  also handling some Capslock+ctrl
;  Capslock+Ctrl to set savedtext to selected text and Capslock+S+Ctrl to paste it.
Control::
	if (GetKeyState("SC056", "P"))	
		send {XButton2}
	else if (GetKeyState("CapsLock", "P"))
	{
		temp := clipboard
		send ^c
		savedtext := clipboard
		clipboard := temp
	}
	else if (GetKeyState("s", "P"))
		sendinput %savedtext%
	else
		send {Control}
	return
Shift::
	if (GetKeyState("SC056", "P"))	
		send {XButton1}
	else
		send {Shift}
	return

;==========================================================================
; Make sure the original functions of keys are available.
;==========================================================================

SC056 & b::send {AppsKey}
LControl & SC056::send {sc056 up}{Lcontrol up}{RWin}
SC056 & u::
if GetKeyState("CapsLock", "T") = 1
 {
   SetCapsLockState, off
 }
else if GetKeyState("CapsLock", "F") = 0
 {
   SetCapsLockState, on
 }
return


;==========================================================================
; Set > + xcv qa ws ed rf.
;==========================================================================

SC056 & x::send {MButton down}  ; Need to remember to "unpress" this!
SC056 & c::send {MButton up}
SC056 & v::send !{PrintScreen}
;LShift & SC056 & e::  ; Can't have 3 keys like this.
SC056 & q::
	if (GetKeyState("Shift", "P"))	
		send +{Home}
	else
		send {Home}
	return
SC056 & a::
	if (GetKeyState("Shift", "P"))	
		send +{End}
	else
		send {End}
	return
SC056 & w::send {WheelUp}
SC056 & s::send {WheelDown}
SC056 & e::
	if (GetKeyState("Shift", "P"))	
		send +{PgUp}
	else
		send {PgUp}
	return
SC056 & d::
	if (GetKeyState("Shift", "P"))	
		send +{PgDn}
	else
		send {PgDn}
	return
;  I'm not in the habit of using delete + shift or control so not adding those
SC056 & r::send {XButton2}
SC056 & f::send {XButton1}

;==========================================================================
; Set > + 1234567 and hn to do stuff in a loop until a variable is set to false
;==========================================================================

SC056 & n::
	macroToggle := false
	ToolTip, macros off
	#Persistent
	SetTimer, RemoveToolTip, 1000
Return

~XButton2::
	macroToggle := false
	ToolTip, macros off
	#Persistent
	SetTimer, RemoveToolTip, 1000
Return

SC056 & h::
	macroToggle := true
	ToolTip, macro toggle on(press < + 123... to activate)
	#Persistent
	SetTimer, RemoveToolTip, 1000
Return

SC056 & 1::
 {
	While, macroToggle
    {
		Send {LButton}
		Sleep 100
    }
 }
Return

SC056 & 2::
 {
	While, macroToggle
    {
		Send {LShift down}
		Send {w down}
		Sleep 100
		Send {Space}
		Sleep 100
		Send {Space}
		Sleep 100
		Send {Space}
		Sleep 100
		Send {Space}
		Sleep 100
		Send {Space}
		Sleep 100
		Send {Space}
		Send {LShift up}
		Send {w up}
		Sleep 1000
    }
 }
Return


;==========================================================================

SC056 & tab::send {Enter}
Enter::send {Enter}


;==========================================================================
; Z+12345qwerasdfxcv
;==========================================================================

;~ SC056 & z::send z


;~ z & 1::
;~ z & 2::
;~ z & 3::
;~ z & 4::
;~ z & 5::

;~ z & q::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {BackSpace}
	;~ else
		;~ send u
	;~ return
;~ z & w::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {BackSpace}
	;~ else
		;~ send i
	;~ return
;~ z & e::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 7
	;~ else
		;~ send o
	;~ return
;~ z & r::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 8
	;~ else
		;~ send p
	;~ return
;~ z & t::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 9
	;~ else
		;~ send å
	;~ return
;~ z & y::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {left}
	;~ else
		;~ send y
	;~ return

;~ z & a::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {left}
	;~ else
		;~ send j
	;~ return
;~ z & s::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {left}
	;~ else
		;~ send k
	;~ return
;~ z & d::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 4
	;~ else
		;~ send l
	;~ return
;~ z & f::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 5
	;~ else
		;~ send ö
	;~ return
;~ z & g::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 6
	;~ else
		;~ send ä
	;~ return
;~ z & h::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send {right}
	;~ else
		;~ send h
	;~ return

;~ z & x::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 0
	;~ else
		;~ send n
	;~ return
;~ z & c::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 1
	;~ else
		;~ send m
	;~ return
;~ z & v::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 2
	;~ else
		;~ send n
	;~ return
;~ z & b::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 3
	;~ else
		;~ send m
	;~ return
;~ z & n::
	;~ if (GetKeyState("space", "P") or numpadtog)	
		;~ send 0
	;~ else
		;~ send n
	;~ return

;~ ^z::^z
;~ +z::+z
;~ !z::!z
;~ z & space:: 
	;~ if (numpadtog)
		;~ send 0
	;~ else
		;~ numpadtog := true
		;~ KeyWait, z, T60
		;~ numpadtog := false
	;~ return
;~ ;space & z::return




;==========================================================================
;
CapsLock::return
;
;==========================================================================



SC056 & CapsLock::send {backspace}
CapsLock & SC056::send {backspace}
CapsLock & space::send {enter}


; caps+(qwert) normally is <>/\' with shift it's +-´`~ and with alt it's 
CapsLock & 1::
	if (GetKeyState("Shift", "P"))	
		send ˇ
	else if (GetKeyState("Alt", "P"))
		send unusable
	else
		send {^}{space}
	return
CapsLock & 2::
	if (GetKeyState("Shift", "P"))	
		send &
	else if (GetKeyState("Alt", "P"))
		send ▲
	else
		send @
	return
CapsLock & 3::
	if (GetKeyState("Shift", "P"))	
		send ※
	else if (GetKeyState("Alt", "P"))
		send ´{space}
	else
		send £
	return
CapsLock & 4::
	if (GetKeyState("Shift", "P"))	
		send 〇
	else if (GetKeyState("Alt", "P"))
		send ▼
	else
		send $
	return
CapsLock & 5::
	if (GetKeyState("Shift", "P"))	
		send ∎
	else if (GetKeyState("Alt", "P"))
		send ¨{space}
	else
		send €
	return

; caps+(qwert) normally is <>/\' with shift it's +-´`~ and with alt it's 
CapsLock & q::
	if (GetKeyState("Shift", "P"))	
		send {+}
	else if (GetKeyState("Alt", "P"))
		send ◎
	else
		send <
	return
CapsLock & w::
	if (GetKeyState("Shift", "P"))	
		send -
	else if (GetKeyState("Alt", "P"))
		send unusable
	else
		send >
	return
CapsLock & e::
	if (GetKeyState("Shift", "P"))	
		send ´{space}
	else if (GetKeyState("Alt", "P"))
		send ◖
	else
		send /
	return
CapsLock & r::
	if (GetKeyState("Shift", "P"))	
		send {``}{space}
	else if (GetKeyState("Alt", "P"))
		send ◗
	else
		send \
	return
CapsLock & t::
	if (GetKeyState("Shift", "P"))	
		send ~{space}
	else if (GetKeyState("Alt", "P"))
		send ¨{space}
	else
		send {,}
	return

; caps+(asdfg) normally is (){}' with shift it's ;:『』 and with alt it's *=「」
CapsLock & a::
	if (GetKeyState("Shift", "P"))	
		send {;}
	else if (GetKeyState("Alt", "P"))
		send 『
	else
		sendraw (
	return
CapsLock & s::
	if (GetKeyState("Shift", "P"))	
		send {:}
	else if (GetKeyState("Alt", "P"))
		send 』
	else
		sendraw )
	return
CapsLock & d::
	if (GetKeyState("Shift", "P"))	
		send {=}
	else if (GetKeyState("Alt", "P"))
		send 「
	else
		sendraw {
	return
CapsLock & f::
	if (GetKeyState("Shift", "P"))	
		send *
	else if (GetKeyState("Alt", "P"))
		send 」
	else
		sendraw }
	return
CapsLock & g::send {.}

; caps+(zxcv) normally is []|_ with shift it's ,.『』 and with alt it's ! 『』
CapsLock & z::
	if (GetKeyState("Shift", "P"))	
		send {,}
	else if (GetKeyState("Alt", "P"))
		send {?}
	else
		send [
	return
;caps+alt+x doesn't work, because alt+x is for unicode numbers? Or my keyboard might just not have that assigned.
CapsLock & x::
	if (GetKeyState("Shift", "P"))	
		send {.}
	else if (GetKeyState("Alt", "P"))
		send unusable
	else
		send ]
	return
CapsLock & c::
	if (GetKeyState("Shift", "P"))	
		send 『
	else if (GetKeyState("Alt", "P"))
		send ◄
	else
		send |
	return
CapsLock & v::
	if (GetKeyState("Shift", "P"))	
		send 』
	else if (GetKeyState("Alt", "P"))
		send ►
	else
		send _
	return
;shouldn't be needed
CapsLock & b::
	if (GetKeyState("Shift", "P"))	
		send {~}{space}
	else if (GetKeyState("Alt", "P"))
		send undecided
	else
		send {^}{space} 
	return
CapsLock & n::send '




;  sugarcube/js comment
CapsLock & F1::
	if (GetKeyState("Shift", "P"))
		send undecided
	else
		send {<}{!}{-}{-}
	return
CapsLock & F2::
	if (GetKeyState("Shift", "P"))
		send undecided
	else
		send -->
	return

;==========================================================================
; wasd arrows toggle
;==========================================================================


;global arrowtog ; not necessary

;change arrowtog variable and show a tooltip for 0.5s
CapsLock & tab::
{
	if (GetKeyState("Shift", "P"))
	{
		arrowtog := 2
		ToolTip, WASD=arrows
	}
	else if (arrowtog = 1 or arrowtog = 2)
	{
		arrowtog := 0
		ToolTip, WASD=WASD
	}
	else
	{
		arrowtog := 1
		ToolTip, <+WASD=arrows
		
	}
	#Persistent
	SetTimer, RemoveToolTip, 1000
	return
}

RemoveToolTip:
SetTimer, RemoveToolTip, Off
ToolTip
return



#If (arrowtog = 1)
SC056 & w::send {Up}
SC056 & a::send {Left}
SC056 & s::send {Down}
SC056 & d::send {Right}

#If (arrowtog = 2 and !GetKeyState("ctrl", "D")) ; 
w::Up
a::Left
s::Down
d::Right

#If

;  prevent double clicking due to faulty mouse or such
LButton::	
	If (A_TimeSincePriorHotkey < 100) ;hyperclick
		Return
	Click Down
	KeyWait, LButton
	Click Up
Return



;==========================================================================
;  hotstrings
;==========================================================================

::wud::would
::cud::could
::sud::should
::wudnt::wouldn't
::cudnt::couldn't
::sudnt::shouldn't
::aw::anyway
;::u::you
::ur::your
::urs::yours


;==========================================================================

;doesn't work?
::isotime:: FormatTime, CurrentDateTime,, yyyy-MM-dd SendInput %CurrentDateTime% return

;==========================================================================


; type " \e \n " for eratohoK macros
SC056 & space::send {space}\e \n{space} 


;==========================================================================
;commandline paste
;==========================================================================


#IfWinActive ahk_class ConsoleWindowClass
^V::
SendInput {Raw}%clipboard%
return
#IfWinActive




;==========================================================================
;keep window on top
;==========================================================================

^SPACE::  Winset, Alwaysontop, , A
^P::Send, _popup

;==========================================================================
;tests
;==========================================================================

;==========================================================================
; copy paste different things with ctrl + alt, shift and alt+shift
; these don't reliably work, I think I saw a thread about getting something like them to work more reliably
;==========================================================================

;interferes with paint.net hotkeys so disabling
/*

; making these global just in case it matters
global altcopy
global shiftcopy
global altshiftcopy

^!x::
 {
   temp1 := clipboard
   sendinput, ^x
   altcopy := clipboard
   clipboard := temp1
 }
return
^+x::
 {
   temp2 := clipboard
   sendinput, ^x
   shiftcopy := clipboard
   clipboard := temp2
 }
return
^!+x::
 {
   temp3 := clipboard
   sendinput, ^x
   altshiftcopy := clipboard
   clipboard := temp3
 }
return

^!c::
 {
   temp1 := clipboard
   sendinput, ^c
   altcopy := clipboard
   clipboard := temp1
 }
return
^+c::
 {
   temp2 := clipboard
   sendinput, ^c
   shiftcopy := clipboard
   clipboard := temp2
 }
return
^!+c::
 {
   temp3 := clipboard
   sendinput, ^c
   altshiftcopy := clipboard
   clipboard := temp3
 }
return

^!v::
 {
   temp1 := clipboard
   sendinput, %altcopy%
   clipboard := temp1
 }
return
^+v::
 {
   temp2 := clipboard
   sendinput, %shiftcopy%
   clipboard := temp2
 }
return
^!+v::
 {
   temp3 := clipboard
   sendinput, %altshiftcopy%
   clipboard := temp3
 }
return

*/

